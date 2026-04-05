import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService, COLUMN_CONFIG } from '../../core/services/board.service';
import { Task, TaskStatus, KanbanColumn, Board } from '../../core/models/models';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskModalComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  boardId = '';
  board = signal<Board | undefined>(undefined);
  columns = signal<KanbanColumn[]>([]);
  showModal = signal(false);
  editingTask = signal<Task | undefined>(undefined);
  selectedStatus = signal<TaskStatus>('todo');

  columnIds = COLUMN_CONFIG.map(c => c.id);

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') ?? 'b1';
    this.board.set(this.boardService.getBoardById(this.boardId));
    this.refreshColumns();
  }

  refreshColumns() {
    this.columns.set(this.boardService.getKanbanColumns(this.boardId));
  }

  onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((t, i) => this.boardService.updateTask(t.id, { order: i }));
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      this.boardService.moveTask(task.id, targetStatus, event.currentIndex);
    }
    this.refreshColumns();
  }

  openCreate(status: TaskStatus) {
    this.editingTask.set(undefined);
    this.selectedStatus.set(status);
    this.showModal.set(true);
  }

  openEdit(task: Task) {
    this.editingTask.set(task);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTask.set(undefined);
    this.refreshColumns();
  }

  deleteTask(id: string) {
    this.boardService.deleteTask(id);
    this.refreshColumns();
  }

  getPriorityLabel(p: string): string {
    const m: Record<string, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica' };
    return m[p] ?? p;
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done') return false;
    return task.dueDate < new Date().toISOString().split('T')[0];
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}
