import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateTaskDto, UpdateTaskDto, CreateSubtaskDto, CreateCommentDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getTasks(search?: string, priority?: string, status?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { assigneeName: { contains: search } },
      ];
    }

    if (priority && priority !== 'All') {
      where.priority = priority;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    return this.prisma.task.findMany({
      where,
      include: {
        subtasks: true,
        comments: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        subtasks: true,
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async createTask(dto: CreateTaskDto) {
    // Get default workspace
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({
        data: { name: 'Dexter' },
      });
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description || '',
        status: dto.status || 'To Do',
        priority: dto.priority || 'Medium',
        dueDate: dto.dueDate || '29 Jul',
        assigneeName: dto.assigneeName || 'Admin',
        assigneeRole: dto.assigneeRole || 'Designer',
        assigneeAvatar: dto.assigneeAvatar || '/avatar.png',
        labels: dto.labels || 'Deployment,Testing',
        workspaceId: workspace.id,
        projectId: dto.projectId || null,
      },
      include: {
        subtasks: true,
        comments: true,
        activityLogs: true,
      },
    });

    // Create initial activity log
    await this.prisma.activityLog.create({
      data: {
        action: 'Task Created',
        details: `Task "${task.title}" was created`,
        taskId: task.id,
      },
    });

    return task;
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    const existing = await this.prisma.task.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updated = await this.prisma.task.update({
      where: { id },
      data: dto,
      include: {
        subtasks: true,
        comments: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Log update if priority or status changed
    if (dto.priority && dto.priority !== existing.priority) {
      await this.prisma.activityLog.create({
        data: {
          action: 'Priority Changed',
          details: `changed priority from ${existing.priority} to ${dto.priority}`,
          taskId: id,
        },
      });
    }

    if (dto.status && dto.status !== existing.status) {
      await this.prisma.activityLog.create({
        data: {
          action: 'Status Changed',
          details: `changed status from ${existing.status} to ${dto.status}`,
          taskId: id,
        },
      });
    }

    return updated;
  }

  async deleteTask(id: string) {
    await this.prisma.task.delete({ where: { id } });
    return { success: true, message: 'Task deleted' };
  }

  async addSubtask(taskId: string, dto: CreateSubtaskDto) {
    return this.prisma.subtask.create({
      data: {
        title: dto.title,
        priority: dto.priority || 'Medium',
        dueDate: dto.dueDate || '12 Sep 2026',
        assigneeName: dto.assigneeName || 'Admin',
        taskId,
      },
    });
  }

  async addComment(taskId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        authorName: dto.authorName || 'Ankit Dutta',
        taskId,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        action: 'Comment Added',
        details: `posted an update`,
        taskId,
      },
    });

    return comment;
  }
}
