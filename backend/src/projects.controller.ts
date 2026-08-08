import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api/projects')
export class ProjectsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getProjects() {
    return this.prisma.project.findMany({
      include: {
        tasks: true,
      },
    });
  }

  @Post()
  async createProject(@Body() body: { name: string; priority?: string; lead?: string; dueDate?: string }) {
    let workspace = await this.prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await this.prisma.workspace.create({ data: { name: 'Dexter' } });
    }

    return this.prisma.project.create({
      data: {
        name: body.name,
        priority: body.priority || 'Medium',
        lead: body.lead || 'Admin',
        dueDate: body.dueDate || '18 Sep 2026',
        workspaceId: workspace.id,
      },
    });
  }
}
