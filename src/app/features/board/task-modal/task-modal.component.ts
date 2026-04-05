import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus, TaskPriority, User } from '../../../core/models/models';
import { BoardService } from '../../../core/services/board.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent implements OnInit {
  @Input() task?: Task;
  @Input() defaultStatus: TaskStatus = 'todo';
  @Input() boardId = 'b1';
  @Output() close   = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();

  isEditing = false;
  saving = signal(false);

  members: User[] = [];

  // Form fields
  title       = '';
  description = '';
  status: TaskStatus   = 'todo';
  priority: TaskPriority = 'medium';
  startDate   = '';
  dueDate     = '';
  assigneeIds = new Set<string>();
  tagInput    = '';
  tags: string[] = [];

  statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo',    label: 'A Fazer' },
    { value: 'doing',   label: 'Em Execução' },
    { value: 'review',  label: 'Em Revisão' },
    { value: 'done',    label: 'Finalizado' },
  ];

  priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low',      label: 'Baixa',   color: '#10B981' },
    { value: 'medium',   label: 'Média',   color: '#F59E0B' },
    { value: 'high',     label: 'Alta',    color: '#EF4444' },
    { value: 'critical', label: 'Crítica', color: '#A855F7' },
  ];

  constructor(private boardService: BoardService, public auth: AuthService) {}

  ngOnInit() {
    this.members = this.boardService.getMockUsers();
    this.isEditing = !!this.task;

    if (this.task) {
      this.title       = this.task.title;
      this.description = this.task.description ?? '';
      this.status      = this.task.status;
      this.priority    = this.task.priority;
      this.startDate   = this.task.startDate ?? '';
      this.dueDate     = this.task.dueDate ?? '';
      this.tags        = [...this.task.tags];
      this.task.assignees.forEach(a => this.assigneeIds.add(a.id));
    } else {
      this.status = this.defaultStatus;
    }
  }

  toggleAssignee(id: string) {
    if (this.assigneeIds.has(id)) this.assigneeIds.delete(id);
    else this.assigneeIds.add(id);
  }

  isAssigned(id: string): boolean { return this.assigneeIds.has(id); }

  addTag(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const v = this.tagInput.trim().toLowerCase();
      if (v && !this.tags.includes(v)) this.tags.push(v);
      this.tagInput = '';
    }
  }

  removeTag(t: string) { this.tags = this.tags.filter(x => x !== t); }

  async save() {
    if (!this.title.trim()) return;
    this.saving.set(true);

    await new Promise(r => setTimeout(r, 400)); // simula latência

    const assignees = this.members.filter(m => this.assigneeIds.has(m.id));

    if (this.isEditing && this.task) {
      this.boardService.updateTask(this.task.id, {
        title: this.title,
        description: this.description,
        status: this.status,
        priority: this.priority,
        startDate: this.startDate || undefined,
        dueDate: this.dueDate || undefined,
        assignees,
        tags: this.tags
      });
    } else {
      this.boardService.createTask({
        title: this.title,
        description: this.description,
        status: this.status,
        priority: this.priority,
        startDate: this.startDate || undefined,
        dueDate: this.dueDate || undefined,
        boardId: this.boardId,
        assignees,
        tags: this.tags,
        order: 999
      });
    }

    this.saving.set(false);
    this.close.emit();
  }

  onDelete() {
    if (this.task && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.deleted.emit(this.task.id);
      this.close.emit();
    }
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
