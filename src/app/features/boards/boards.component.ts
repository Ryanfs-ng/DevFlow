import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/models';
import { BoardModalComponent } from './board-modal/board-modal.component';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, RouterLink, BoardModalComponent],
  templateUrl: './boards.component.html',
  styleUrl: './boards.component.scss'
})
export class BoardsComponent implements OnInit {
  boards = signal<Board[]>([]);
  boardModal = signal<'closed' | 'create' | Board>('closed');
  menuBoardId = signal<string | null>(null);

  constructor(
    private boardService: BoardService,
    private router: Router
  ) {}

  asBoard(v: 'closed' | 'create' | Board): Board | null {
    return v !== 'closed' && v !== 'create' ? v : null;
  }

  openCreate(ev?: Event) {
    ev?.stopPropagation();
    this.menuBoardId.set(null);
    this.boardModal.set('create');
  }

  openEdit(board: Board, ev?: Event) {
    ev?.stopPropagation();
    ev?.preventDefault();
    this.menuBoardId.set(null);
    this.boardModal.set(board);
  }

  toggleMenu(ev: Event, boardId: string) {
    ev.stopPropagation();
    ev.preventDefault();
    this.menuBoardId.update(cur => (cur === boardId ? null : boardId));
  }

  async confirmDeleteBoard(board: Board, ev?: Event) {
    ev?.stopPropagation();
    this.menuBoardId.set(null);
    if (!confirm(`Excluir o board "${board.name}"? Todas as tarefas deste board serão apagadas.`)) return;
    await this.boardService.deleteBoard(board.id);
    this.boards.set(this.boardService.getBoards()());
  }

  closeBoardModal() {
    this.boardModal.set('closed');
  }

  onBoardCreated(board: Board) {
    this.boards.set(this.boardService.getBoards()());
    this.boardModal.set('closed');
    void this.router.navigate(['/board', board.id]);
  }

  onBoardUpdated(_board: Board) {
    this.boards.set(this.boardService.getBoards()());
    this.boardModal.set('closed');
  }

  async ngOnInit() {
    await this.boardService.loadBoards();
    this.boards.set(this.boardService.getBoards()());
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.menuBoardId.set(null);
  }

  getProgress(b: Board): number {
    return b.taskCount > 0 ? Math.round((b.completedCount / b.taskCount) * 100) : 0;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}
