import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string; // "To Do", "Doing", "Completed", "On Hold"

  @IsString()
  @IsOptional()
  priority?: string; // "No Priority", "Urgent", "High", "Medium", "Low"

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeName?: string;

  @IsString()
  @IsOptional()
  assigneeRole?: string;

  @IsString()
  @IsOptional()
  assigneeAvatar?: string;

  @IsString()
  @IsOptional()
  labels?: string;

  @IsString()
  @IsOptional()
  projectId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeName?: string;

  @IsString()
  @IsOptional()
  assigneeRole?: string;

  @IsString()
  @IsOptional()
  labels?: string;
}

export class CreateSubtaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  assigneeName?: string;
}

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  authorName?: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  colorMode?: string;
}
