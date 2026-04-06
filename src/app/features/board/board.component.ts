import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService, COLUMN_CONFIG } from '../../core/services/board.service';
import { Task, TaskStatus, KanbanColumn, Board } from '../../core/models/models';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { BoardModalComponent } from '../boards/board-modal/board-modal.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskModalComponent, BoardModalComponent],
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

  boardMenuOpen = signal(false);
  showBoardEditModal = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService
  ) {}

  toggleBoardMenu() {
    this.boardMenuOpen.update(v => !v);
  }

  openBoardEdit() {
    this.boardMenuOpen.set(false);
    this.showBoardEditModal.set(true);
  }

  async deleteCurrentBoard() {
    this.boardMenuOpen.set(false);
    const b = this.board();
    if (!b) return;
    if (!confirm(`Excluir o board "${b.name}"? Todas as tarefas serão apagadas.`)) return;
    await this.boardService.deleteBoard(this.boardId);
    void this.router.navigate(['/boards']);
  }

  onBoardUpdatedFromModal(updated: Board) {
    this.board.set(updated);
    this.showBoardEditModal.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent) {
    if (!this.boardMenuOpen()) return;
    const t = ev.target as HTMLElement;
    if (t.closest('.board-menu-wrap')) return;
    this.boardMenuOpen.set(false);
  }

  async ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') ?? '';
    await this.boardService.loadBoards();
    await this.boardService.loadTasksByBoard(this.boardId);
    this.board.set(this.boardService.getBoardById(this.boardId));
    this.refreshColumns();
  }

  refreshColumns() {
    this.columns.set(this.boardService.getKanbanColumns(this.boardId));
  }

  async onDrop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      for (let i = 0; i < event.container.data.length; i++) {
        await this.boardService.updateTask(event.container.data[i].id, { order: i });
      }
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      await this.boardService.moveTask(task.id, targetStatus, event.currentIndex);
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

  async deleteTask(id: string) {
    await this.boardService.deleteTask(id);
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
