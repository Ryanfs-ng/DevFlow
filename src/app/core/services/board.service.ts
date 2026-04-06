import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Board, Task, TaskStatus, KanbanColumn, User, DashboardMetrics } from '../models/models';
import { API_BASE_URL } from '../api.config';

export const COLUMN_CONFIG: KanbanColumn[] = [
  { id: 'backlog', label: 'Backlog',       color: '#6B7280', tasks: [] },
  { id: 'todo',    label: 'A Fazer',       color: '#3B82F6', tasks: [] },
  { id: 'doing',   label: 'Em Execução',   color: '#F59E0B', tasks: [] },
  { id: 'review',  label: 'Em Revisão',    color: '#A855F7', tasks: [] },
  { id: 'done',    label: 'Finalizado',    color: '#10B981', tasks: [] }
];

/** Corpo esperado pelo backend (POST /api/tasks) — sem assignees aninhados. */
interface TaskCreateBody {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Task['priority'];
  boardId: string;
  assigneeIds: string[];
  tags: string[];
  startDate: string | null;
  dueDate: string | null;
  order: number;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private tasks  = signal<Task[]>([]);
  private boards = signal<Board[]>([]);

  constructor(private http: HttpClient) {}

  getBoards() { return this.boards; }
  getTasks()  { return this.tasks; }

  async loadBoards(): Promise<void> {
    const data = await firstValueFrom(this.http.get<Board[]>(`${API_BASE_URL}/boards`));
    this.boards.set(data);
  }

  async createBoard(payload: {
    name: string;
    description?: string | null;
    color: string;
    emoji: string;
    memberIds: string[];
  }): Promise<Board> {
    const board = await firstValueFrom(
      this.http.post<Board>(`${API_BASE_URL}/boards`, {
        name: payload.name.trim(),
        description: payload.description?.trim() || null,
        color: payload.color,
        emoji: payload.emoji,
        memberIds: payload.memberIds
      })
    );
    this.boards.update(list => [...list, board]);
    return board;
  }

  async updateBoard(
    id: string,
    payload: {
      name: string;
      description?: string | null;
      color: string;
      emoji: string;
      memberIds: string[];
    }
  ): Promise<Board> {
    const board = await firstValueFrom(
      this.http.put<Board>(`${API_BASE_URL}/boards/${id}`, {
        name: payload.name.trim(),
        description: payload.description?.trim() ?? '',
        color: payload.color,
        emoji: payload.emoji,
        memberIds: payload.memberIds
      })
    );
    this.boards.update(list => list.map(b => (b.id === id ? board : b)));
    return board;
  }

  async deleteBoard(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_BASE_URL}/boards/${id}`));
    this.boards.update(list => list.filter(b => b.id !== id));
    this.tasks.update(tasks => tasks.filter(t => t.boardId !== id));
  }

  async loadTasksByBoard(boardId: string): Promise<void> {
    const data = await firstValueFrom(this.http.get<Task[]>(`${API_BASE_URL}/boards/${boardId}/tasks`));
    this.tasks.set(data);
  }

  async loadAllTasks(): Promise<void> {
    const data = await firstValueFrom(this.http.get<Task[]>(`${API_BASE_URL}/tasks`));
    this.tasks.set(data);
  }

  getBoardById(id: string): Board | undefined {
    return this.boards().find(b => b.id === id);
  }

  getTasksByBoard(boardId: string): Task[] {
    return this.tasks().filter(t => t.boardId === boardId);
  }

  getKanbanColumns(boardId: string): KanbanColumn[] {
    const boardTasks = this.getTasksByBoard(boardId);
    return COLUMN_CONFIG.map(col => ({
      ...col,
      tasks: boardTasks
        .filter(t => t.status === col.id)
        .sort((a, b) => a.order - b.order)
    }));
  }

  async moveTask(taskId: string, newStatus: TaskStatus, newOrder: number): Promise<void> {
    const updated = await firstValueFrom(
      this.http.put<Task>(`${API_BASE_URL}/tasks/${taskId}`, { status: newStatus, order: newOrder })
    );
    this.tasks.update(tasks =>
      tasks.map(t => (t.id === taskId ? { ...t, ...updated } : t))
    );
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const body: TaskCreateBody = {
      title: task.title,
      description: task.description ?? null,
      status: task.status,
      priority: task.priority,
      boardId: task.boardId,
      assigneeIds: task.assignees.map(a => a.id),
      tags: task.tags ?? [],
      startDate: task.startDate || null,
      dueDate: task.dueDate || null,
      order: task.order
    };
    const newTask = await firstValueFrom(this.http.post<Task>(`${API_BASE_URL}/tasks`, body));
    this.tasks.update(t => [...t, newTask]);
    return newTask;
  }

  async updateTask(id: string, changes: Partial<Task>): Promise<void> {
    const body = this.buildTaskPatchPayload(changes);
    const updated = await firstValueFrom(this.http.put<Task>(`${API_BASE_URL}/tasks/${id}`, body));
    this.tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, ...updated } : t)));
  }

  private buildTaskPatchPayload(changes: Partial<Task>): Record<string, unknown> {
    const body: Record<string, unknown> = {};
    if (changes.title !== undefined) body['title'] = changes.title;
    if (changes.description !== undefined) body['description'] = changes.description ?? null;
    if (changes.status !== undefined) body['status'] = changes.status;
    if (changes.priority !== undefined) body['priority'] = changes.priority;
    if (changes.boardId !== undefined) body['boardId'] = changes.boardId;
    if (changes.assignees !== undefined) {
      body['assigneeIds'] = changes.assignees.map(a => a.id);
    }
    if (changes.tags !== undefined) body['tags'] = changes.tags;
    if (changes.startDate !== undefined) body['startDate'] = changes.startDate || null;
    if (changes.dueDate !== undefined) body['dueDate'] = changes.dueDate || null;
    if (changes.order !== undefined) body['order'] = changes.order;
    return body;
  }

  async deleteTask(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_BASE_URL}/tasks/${id}`));
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return firstValueFrom(this.http.get<DashboardMetrics>(`${API_BASE_URL}/dashboard/metrics`));
  }

  async getUsers(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${API_BASE_URL}/users`));
  }
}
