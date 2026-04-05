import { Injectable, signal } from '@angular/core';
import { Board, Task, TaskStatus, KanbanColumn, User } from '../models/models';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Ryan Ferreira', email: 'ryan@devflow.com', initials: 'RF', role: 'admin', color: '#6366F1' },
  { id: '2', name: 'Pedro Paulo', email: 'pedro@devflow.com', initials: 'PP', role: 'developer', color: '#22D3EE' },
  { id: '3', name: 'João', email: 'joao@devflow.com', initials: 'JV', role: 'designer', color: '#10B981' },
  { id: '4', name: 'Enzo Gabriel', email: 'enzo@devflow.com', initials: 'EG', role: 'qa', color: '#F59E0B' },
  { id: '5', name: 'Felipe de Moura', email: 'felipe@devflow.com', initials: 'FM', role: 'manager', color: '#A855F7' }
];

const MOCK_BOARDS: Board[] = [
  {
    id: 'b1', name: 'Sprint 12 — Plataforma Core', emoji: '🚀',
    color: '#6366F1', description: 'Desenvolvimento do core da plataforma DevFlow.',
    members: MOCK_USERS.slice(0, 4),
    taskCount: 24, completedCount: 18,
    createdAt: '2026-03-01', updatedAt: '2026-04-05'
  },
  {
    id: 'b2', name: 'Design System v2', emoji: '🎨',
    color: '#22D3EE', description: 'Refatoração e expansão do design system.',
    members: [MOCK_USERS[0], MOCK_USERS[2]],
    taskCount: 15, completedCount: 9,
    createdAt: '2026-03-10', updatedAt: '2026-04-04'
  },
  {
    id: 'b3', name: 'API Gateway Integration', emoji: '⚡',
    color: '#10B981', description: 'Integração com o API Gateway do backend Java.',
    members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[4]],
    taskCount: 18, completedCount: 6,
    createdAt: '2026-03-15', updatedAt: '2026-04-03'
  },
  {
    id: 'b4', name: 'QA & Testes Automatizados', emoji: '🧪',
    color: '#F59E0B', description: 'Cobertura de testes E2E e unitários.',
    members: [MOCK_USERS[3], MOCK_USERS[4]],
    taskCount: 12, completedCount: 4,
    createdAt: '2026-03-20', updatedAt: '2026-04-02'
  }
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1', boardId: 'b1', title: 'Implementar autenticação JWT', order: 0,
    description: 'Criar o fluxo completo de autenticação com refresh token e blacklist.',
    status: 'done', priority: 'critical',
    assignees: [MOCK_USERS[0], MOCK_USERS[1]],
    tags: ['backend', 'segurança'],
    startDate: '2026-03-01', dueDate: '2026-03-07',
    createdAt: '2026-03-01', updatedAt: '2026-03-07',
    commentsCount: 5, attachmentsCount: 2
  },
  {
    id: 't2', boardId: 'b1', title: 'Criar CRUD de Tarefas', order: 1,
    description: 'Endpoints REST para criação, edição, exclusão e listagem de tarefas.',
    status: 'done', priority: 'high',
    assignees: [MOCK_USERS[1]],
    tags: ['backend', 'api'],
    startDate: '2026-03-05', dueDate: '2026-03-12',
    createdAt: '2026-03-05', updatedAt: '2026-03-12',
    commentsCount: 3, attachmentsCount: 0
  },
  {
    id: 't3', boardId: 'b1', title: 'Dashboard de métricas', order: 0,
    description: 'Tela de dashboard com gráficos de produtividade da equipe.',
    status: 'doing', priority: 'high',
    assignees: [MOCK_USERS[0], MOCK_USERS[2]],
    tags: ['frontend', 'ui'],
    startDate: '2026-03-20', dueDate: '2026-04-10',
    createdAt: '2026-03-20', updatedAt: '2026-04-04',
    commentsCount: 8, attachmentsCount: 3
  },
  {
    id: 't4', boardId: 'b1', title: 'Kanban Board com Drag & Drop', order: 1,
    description: 'Implementar o quadro Kanban interativo com arrastar e soltar.',
    status: 'doing', priority: 'critical',
    assignees: [MOCK_USERS[0]],
    tags: ['frontend', 'angular'],
    startDate: '2026-03-25', dueDate: '2026-04-15',
    createdAt: '2026-03-25', updatedAt: '2026-04-05',
    commentsCount: 12, attachmentsCount: 1
  },
  {
    id: 't5', boardId: 'b1', title: 'Notificações em tempo real', order: 0,
    description: 'Implementar WebSocket para notificações push.',
    status: 'review', priority: 'medium',
    assignees: [MOCK_USERS[1], MOCK_USERS[4]],
    tags: ['backend', 'websocket'],
    startDate: '2026-03-28', dueDate: '2026-04-08',
    createdAt: '2026-03-28', updatedAt: '2026-04-05',
    commentsCount: 4, attachmentsCount: 0
  },
  {
    id: 't6', boardId: 'b1', title: 'Configurar CI/CD pipeline', order: 0,
    description: 'Setup do pipeline de integração e entrega contínua com GitHub Actions.',
    status: 'todo', priority: 'medium',
    assignees: [MOCK_USERS[4]],
    tags: ['devops'],
    startDate: '2026-04-07', dueDate: '2026-04-14',
    createdAt: '2026-04-01', updatedAt: '2026-04-01',
    commentsCount: 1, attachmentsCount: 0
  },
  {
    id: 't7', boardId: 'b1', title: 'Internacionalização (i18n)', order: 1,
    description: 'Adicionar suporte a múltiplos idiomas (PT-BR, EN).',
    status: 'todo', priority: 'low',
    assignees: [MOCK_USERS[2]],
    tags: ['frontend'],
    startDate: '2026-04-10', dueDate: '2026-04-20',
    createdAt: '2026-04-01', updatedAt: '2026-04-01',
    commentsCount: 0, attachmentsCount: 0
  },
  {
    id: 't8', boardId: 'b1', title: 'Migração para PostgreSQL', order: 0,
    description: 'Migrar o banco de dados local para PostgreSQL em produção.',
    status: 'backlog', priority: 'high',
    assignees: [],
    tags: ['backend', 'database'],
    startDate: undefined, dueDate: '2026-05-01',
    createdAt: '2026-04-02', updatedAt: '2026-04-02',
    commentsCount: 2, attachmentsCount: 0
  },
  {
    id: 't9', boardId: 'b1', title: 'Relatórios em PDF', order: 1,
    description: 'Gerar relatórios exportáveis em PDF para gestores.',
    status: 'backlog', priority: 'medium',
    assignees: [],
    tags: ['feature'],
    startDate: undefined, dueDate: undefined,
    createdAt: '2026-04-03', updatedAt: '2026-04-03',
    commentsCount: 0, attachmentsCount: 0
  }
];

export const COLUMN_CONFIG: KanbanColumn[] = [
  { id: 'backlog', label: 'Backlog', color: '#6B7280', tasks: [] },
  { id: 'todo', label: 'A Fazer', color: '#3B82F6', tasks: [] },
  { id: 'doing', label: 'Em Execução', color: '#F59E0B', tasks: [] },
  { id: 'review', label: 'Em Revisão', color: '#A855F7', tasks: [] },
  { id: 'done', label: 'Finalizado', color: '#10B981', tasks: [] }
];

@Injectable({ providedIn: 'root' })
export class BoardService {
  private tasks = signal<Task[]>(MOCK_TASKS);
  private boards = signal<Board[]>(MOCK_BOARDS);

  getBoards() { return this.boards; }
  getTasks() { return this.tasks; }

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

  moveTask(taskId: string, newStatus: TaskStatus, newOrder: number): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === taskId ? { ...t, status: newStatus, order: newOrder, updatedAt: new Date().toISOString() } : t)
    );
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: 't' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.update(t => [...t, newTask]);
    return newTask;
  }

  updateTask(id: string, changes: Partial<Task>): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t)
    );
  }

  deleteTask(id: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  getDashboardMetrics() {
    const all = this.tasks();
    const today = new Date().toISOString().split('T')[0];
    return {
      total: all.length,
      doing: all.filter(t => t.status === 'doing').length,
      done: all.filter(t => t.status === 'done').length,
      overdue: all.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length,
      backlog: all.filter(t => t.status === 'backlog').length
    };
  }

  getMockUsers(): User[] { return MOCK_USERS; }
}
