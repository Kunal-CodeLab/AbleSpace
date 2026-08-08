export type TaskStatus = 'To Do' | 'Doing' | 'Completed' | 'On Hold';
export type TaskPriority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';
export type ViewMode = 'Board' | 'List';
export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

export interface Subtask {
  id: string;
  title: string;
  status: string;
  completed?: boolean;
  priority: TaskPriority;
  dueDate?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  taskId: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  taskId: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  startDate?: string;
  assigneeName?: string;
  assigneeRole?: string;
  assigneeAvatar?: string;
  reporterName?: string;
  reporterAvatar?: string;
  labels?: string; // Comma separated or string
  projectId?: string;
  subtasks?: Subtask[];
  comments?: Comment[];
  attachments?: FileAttachment[];
  resources?: string[];
  activityLogs?: ActivityLog[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  priority: TaskPriority;
  status?: TaskStatus;
  lead?: string;
  leadAvatar?: string;
  dueDate?: string;
  description?: string;
  team?: string;
  labels?: string[];
  reporter?: string;
  tasks?: Task[];
}

export interface UserProfile {
  id?: string;
  email: string;
  fullName: string;
  title?: string;
  username?: string;
  avatar?: string;
  role?: string;
  theme: ThemeMode;
  colorMode: ColorMode;
}
