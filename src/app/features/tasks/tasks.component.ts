import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { Task } from '../../core/models/models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
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

  async ngOnInit() {
    await Promise.all([
      this.boardService.loadBoards(),
      this.boardService.loadAllTasks()
    ]);
    this.tasks.set(this.boardService.getTasks()());
  }

  boardLabel(boardId: string): string {
    const board = this.boardService.getBoardById(boardId);
    return board?.name?.trim() || '—';
  }

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
