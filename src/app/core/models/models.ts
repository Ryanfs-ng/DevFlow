// ─── User / Member ─────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  role: 'admin' | 'developer' | 'designer' | 'manager' | 'qa';
  color: string;
}

// ─── Task ──────────────────────────────────────
export type TaskStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  boardId: string;
  assignees: User[];
  tags: string[];
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  subtasks?: Subtask[];
  commentsCount?: number;
  attachmentsCount?: number;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

// ─── Board ─────────────────────────────────────
export interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  emoji: string;
  members: User[];
  taskCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Dashboard ─────────────────────────────────
export interface DashboardMetrics {
  total: number;
  doing: number;
  done: number;
  overdue: number;
  backlog: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

// ─── Auth ──────────────────────────────────────
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

// ─── Kanban Column ─────────────────────────────
export interface KanbanColumn {
  id: TaskStatus;
  label: string;
  color: string;
  tasks: Task[];
  limit?: number;
}
