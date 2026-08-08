import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ProjectsController } from './projects.controller';
import { UsersController, AuthController } from './users.controller';

@Module({
  imports: [],
  controllers: [TasksController, ProjectsController, UsersController, AuthController],
  providers: [PrismaService, TasksService],
})
export class AppModule {}
