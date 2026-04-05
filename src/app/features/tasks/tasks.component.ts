import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { Task } from '../../core/models/models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="tasks-page">
    <div class="tasks-header">
      <div>
        <h1>Todas as Tarefas</h1>
        <p>{{ tasks().length }} tarefas encontradas</p>
      </div>
      <div class="tasks-filters">
        <div class="filter-group">
          @for (s of statusFilters; track s.value) {
            <button
              class="filter-btn"
              [class.active]="activeStatus() === s.value"
              (click)="setStatus(s.value)"
            >{{ s.label }}</button>
          }
        </div>
      </div>
    </div>

    <div class="tasks-table-wrapper">
      <table class="tasks-table">
        <thead>
          <tr>
            <th>Tarefa</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th>Atribuído a</th>
            <th>Data de Término</th>
            <th>Board</th>
          </tr>
        </thead>
        <tbody>
          @for (task of filteredTasks(); track task.id) {
            <tr class="task-row animate-fade-in">
              <td>
                <div class="task-cell-title">
                  <div class="status-dot" [attr.data-status]="task.status"></div>
                  <span>{{ task.title }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [attr.data-status]="task.status">
                  {{ getStatusLabel(task.status) }}
                </span>
              </td>
              <td>
                <span class="priority priority-{{task.priority}}">{{ getPriorityLabel(task.priority) }}</span>
              </td>
              <td>
                <div class="assignee-list">
                  @for (a of task.assignees.slice(0, 3); track a.id) {
                    <div class="avatar avatar-sm" [style.background]="a.color" [title]="a.name">{{ a.initials }}</div>
                  }
                  @if (task.assignees.length === 0) {
                    <span class="unassigned">—</span>
                  }
                </div>
              </td>
              <td>
                @if (task.dueDate) {
                  <span class="due-date" [class.overdue]="isOverdue(task)">{{ formatDate(task.dueDate) }}</span>
                } @else {
                  <span class="no-date">—</span>
                }
              </td>
              <td>
                <span class="board-tag">Sprint 12</span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [`
    .tasks-page { padding: var(--space-8); }
    .tasks-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4);
      h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; margin-bottom: 4px; }
      p  { font-size: 14px; color: var(--text-secondary); }
    }
    .filter-group { display: flex; gap: 4px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 4px; }
    .filter-btn {
      padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500;
      color: var(--text-secondary); background: none; border: none; cursor: pointer;
      transition: all var(--transition-fast); font-family: var(--font-sans);
      &:hover { color: var(--text-primary); }
      &.active { background: var(--bg-raised); color: var(--text-primary); font-weight: 600; }
    }
    .tasks-table-wrapper {
      background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden;
    }
    .tasks-table {
      width: 100%; border-collapse: collapse;
      th {
        padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700;
        color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;
        background: var(--bg-raised); border-bottom: 1px solid var(--border);
      }
      td { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; }
      tr:last-child td { border-bottom: none; }
    }
    .task-row {
      transition: background var(--transition-fast);
      &:hover td { background: var(--bg-raised); }
    }
    .task-cell-title { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: var(--text-primary); }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
      &[data-status="backlog"] { background: var(--status-backlog); }
      &[data-status="todo"]    { background: var(--status-todo); }
      &[data-status="doing"]   { background: var(--status-doing); }
      &[data-status="review"]  { background: var(--status-review); }
      &[data-status="done"]    { background: var(--status-done); }
    }
    .status-badge {
      display: inline-flex; padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600; letter-spacing: 0.2px;
      &[data-status="backlog"] { background: rgba(107,114,128,0.12); color: #9CA3AF; }
      &[data-status="todo"]    { background: var(--info-bg); color: var(--info); }
      &[data-status="doing"]   { background: var(--warning-bg); color: var(--warning); }
      &[data-status="review"]  { background: rgba(168,85,247,0.12); color: #A855F7; }
      &[data-status="done"]    { background: var(--success-bg); color: var(--success); }
    }
    .assignee-list { display: flex; .avatar-sm { margin-left: -4px; border: 1.5px solid var(--bg-surface); &:first-child { margin-left: 0; } } }
    .unassigned { font-size: 14px; color: var(--text-disabled); }
    .due-date { font-size: 13px; color: var(--text-secondary); font-family: var(--font-mono); &.overdue { color: var(--danger); } }
    .no-date { color: var(--text-disabled); }
    .board-tag { font-size: 12px; padding: 3px 10px; border-radius: var(--radius-full); background: var(--bg-elevated); color: var(--text-secondary); }
  `]
})
export class TasksComponent implements OnInit {
  tasks = signal<Task[]>([]);
  activeStatus = signal('all');

  statusFilters = [
    { value: 'all', label: 'Todas' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo',   label: 'A Fazer' },
    { value: 'doing',  label: 'Em Execução' },
    { value: 'review', label: 'Em Revisão' },
    { value: 'done',   label: 'Finalizadas' },
  ];

  filteredTasks = () => {
    const s = this.activeStatus();
    if (s === 'all') return this.tasks();
    return this.tasks().filter(t => t.status === s);
  };

  constructor(private boardService: BoardService) {}

  ngOnInit() { this.tasks.set(this.boardService.getTasks()()); }

  setStatus(s: string) { this.activeStatus.set(s); }

  isOverdue(t: Task): boolean {
    if (!t.dueDate || t.status === 'done') return false;
    return t.dueDate < new Date().toISOString().split('T')[0];
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  getStatusLabel(s: string): string {
    const m: Record<string, string> = { backlog: 'Backlog', todo: 'A Fazer', doing: 'Em Execução', review: 'Em Revisão', done: 'Finalizado' };
    return m[s] ?? s;
  }

  getPriorityLabel(p: string): string {
    const m: Record<string, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica' };
    return m[p] ?? p;
  }
}
