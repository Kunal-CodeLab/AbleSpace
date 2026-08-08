import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data matching Figma screenshots...');

  // 1. Create Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Dexter',
    },
  });

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email: 'dexter@gmail.com',
      fullName: 'Dexter',
      title: 'Designer',
      username: 'Dexuser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      theme: 'light',
      colorMode: 'blue',
    },
  });

  // 3. Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Design Homepage',
      priority: 'High',
      lead: 'Dexter',
      dueDate: '12 Sep 2026',
      workspaceId: workspace.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Develop Login Feature',
      priority: 'Low',
      lead: 'CN',
      dueDate: '15 Sep 2026',
      workspaceId: workspace.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Test Payment Gateway',
      priority: 'Medium',
      lead: 'Admin',
      dueDate: '18 Sep 2026',
      workspaceId: workspace.id,
    },
  });

  // 4. Create Tasks matching 2.PNG
  const task1 = await prisma.task.create({
    data: {
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.',
      status: 'To Do',
      priority: 'High',
      dueDate: '29 Jul',
      assigneeName: 'Admin',
      assigneeRole: 'Designer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      labels: 'Deployment,Deployment,Research,Design,Development,Testing',
      workspaceId: workspace.id,
      projectId: project1.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Implement Search Function',
      description: 'Add live fuzzy search across all tasks with keyboard shortcuts (Cmd+F).',
      status: 'To Do',
      priority: 'Low',
      dueDate: '29 Jul',
      assigneeName: 'Admin',
      assigneeRole: 'Developer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      labels: 'Deployment,Deployment',
      workspaceId: workspace.id,
      projectId: project2.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Deploy to Production',
      description: 'Configure CI/CD deployment pipelines on Vercel/Render.',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '29 Jul',
      assigneeName: 'Admin',
      assigneeRole: 'DevOps',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      labels: 'Deployment,Deployment',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Code Review Completed',
      description: 'Review backend NestJS controller endpoints and database schemas.',
      status: 'Doing',
      priority: 'High',
      dueDate: '29 Jul',
      assigneeName: 'Admin',
      assigneeRole: 'Lead',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      labels: 'Deployment,Deployment',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Design Mockups Finalized',
      description: 'Finalize Figma design components and design tokens.',
      status: 'Doing',
      priority: 'Urgent',
      dueDate: '29 Jul',
      assigneeName: 'Admin',
      assigneeRole: 'Designer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      labels: 'Deployment,Deployment',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Feature Testing Passed',
      description: 'QA validation across tablet, mobile and desktop responsive views.',
      status: 'Completed',
      priority: 'High',
      dueDate: '30 Jul',
      assigneeName: 'QA Team',
      assigneeRole: 'QA',
      assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      labels: 'Testing,Passed',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'UI Design Updated',
      description: 'Updated dark and light mode color palette swatches.',
      status: 'Completed',
      priority: 'Medium',
      dueDate: '31 Jul',
      assigneeName: 'Designer',
      assigneeRole: 'Designer',
      assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      labels: 'Design,Updated',
      workspaceId: workspace.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Security Audit Scheduled',
      description: 'Schedule annual security penetration testing and code audit.',
      status: 'Completed',
      priority: 'Urgent',
      dueDate: '01 Aug',
      assigneeName: 'Security',
      assigneeRole: 'Security Lead',
      assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      labels: 'Audit,Scheduled',
      workspaceId: workspace.id,
    },
  });

  // 5. Add Subtasks for task1 (matching photo_2026-08-07_17-51-48.jpg)
  await prisma.subtask.createMany({
    data: [
      {
        title: 'Subtask 1',
        priority: 'High',
        dueDate: '12 Sep 2026',
        assigneeName: 'Admin',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        taskId: task1.id,
      },
      {
        title: 'Subtask 2',
        priority: 'Low',
        dueDate: '15 Sep 2026',
        assigneeName: 'CN',
        assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        taskId: task1.id,
      },
      {
        title: 'Subtask 3',
        priority: 'Medium',
        dueDate: '18 Sep 2026',
        assigneeName: 'Dexter',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        taskId: task1.id,
      },
    ],
  });

  // 6. Add Comments for task1
  await prisma.comment.create({
    data: {
      content: 'dsds',
      authorName: 'Ankit Dutta',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      taskId: task1.id,
    },
  });

  // 7. Add Activity Logs for task1
  await prisma.activityLog.createMany({
    data: [
      {
        action: 'Priority Changed',
        details: 'changed priority from No priority to Urgent',
        taskId: task1.id,
      },
      {
        action: 'Update Posted',
        details: 'posted an update · Aug 2026',
        taskId: task1.id,
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
