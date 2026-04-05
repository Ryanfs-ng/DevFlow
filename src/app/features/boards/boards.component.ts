import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { Board } from '../../core/models/models';

@Component({
  selector: 'app-boards',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="boards-page">
    <div class="boards-page-header">
      <div>
        <h1>Meus Boards</h1>
        <p>Gerencie all seus projetos em um único lugar</p>
      </div>
      <button class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Novo Board
      </button>
    </div>

    <div class="boards-grid">
      @for (board of boards(); track board.id; let i = $index) {
        <a class="board-card animate-fade-in" [class]="'stagger-' + (i+1)" [routerLink]="['/board', board.id]">
          <div class="board-card-accent" [style.background]="board.color"></div>
          <div class="board-card-header">
            <div class="board-emoji" [style.background]="board.color + '22'" [style.color]="board.color">
              {{ board.emoji }}
            </div>
            <div class="board-card-menu">···</div>
          </div>
          <div class="board-card-body">
            <h3>{{ board.name }}</h3>
            <p>{{ board.description }}</p>
          </div>
          <div class="board-card-progress">
            <div class="progress-info">
              <span>Progresso</span>
              <span class="progress-num">{{ board.completedCount }}/{{ board.taskCount }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width]="getProgress(board) + '%'" [style.background]="board.color"></div>
            </div>
          </div>
          <div class="board-card-footer">
            <div class="board-members">
              @for (m of board.members.slice(0, 4); track m.id) {
                <div class="avatar avatar-sm" [style.background]="m.color" [title]="m.name">{{ m.initials }}</div>
              }
              @if (board.members.length > 4) {
                <div class="avatar avatar-sm avatar-more">+{{ board.members.length - 4 }}</div>
              }
            </div>
            <span class="board-updated">Atualizado {{ formatDate(board.updatedAt) }}</span>
          </div>
        </a>
      }

      <!-- New board card -->
      <div class="board-card board-card--new">
        <div class="board-card-new-content">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Criar novo board</span>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .boards-page { padding: var(--space-8); }
    .boards-page-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: var(--space-8);
      h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; margin-bottom: 4px; }
      p  { font-size: 14px; color: var(--text-secondary); }
    }
    .boards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-4);
    }
    .board-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      display: flex; flex-direction: column; gap: var(--space-4);
      text-decoration: none;
      transition: all var(--transition-base);
      cursor: pointer;
      position: relative; overflow: hidden;
      &:hover { border-color: var(--border-accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
      &--new {
        border-style: dashed; background: transparent;
        align-items: center; justify-content: center;
        min-height: 200px;
        &:hover { background: var(--bg-surface); }
      }
    }
    .board-card-accent {
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
    }
    .board-card-header { display: flex; align-items: center; justify-content: space-between; }
    .board-emoji {
      width: 44px; height: 44px; border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center; font-size: 22px;
    }
    .board-card-menu { font-size: 18px; color: var(--text-muted); cursor: pointer; letter-spacing: 2px; padding: 4px; }
    .board-card-body {
      h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
      p  { font-size: 12px; color: var(--text-secondary); line-height: 1.5;
           display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    }
    .board-card-progress { display: flex; flex-direction: column; gap: 6px; }
    .progress-info {
      display: flex; justify-content: space-between;
      font-size: 12px; color: var(--text-muted);
    }
    .progress-num { font-weight: 600; color: var(--text-secondary); }
    .progress-bar { height: 4px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; }
    .progress-fill { height: 100%; border-radius: var(--radius-full); transition: width 0.6s ease; }
    .board-card-footer { display: flex; align-items: center; justify-content: space-between; }
    .board-members { display: flex; .avatar-sm { margin-left: -6px; border: 2px solid var(--bg-surface); &:first-child { margin-left: 0; } } }
    .avatar-more { background: var(--bg-elevated) !important; color: var(--text-muted) !important; font-size: 10px; }
    .board-updated { font-size: 11px; color: var(--text-disabled); }
    .board-card-new-content { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-disabled); font-size: 14px; }
  `]
})
export class BoardsComponent implements OnInit {
  boards = signal<Board[]>([]);

  constructor(private boardService: BoardService) {}

  ngOnInit() { this.boards.set(this.boardService.getBoards()()); }

  getProgress(b: Board): number {
    return b.taskCount > 0 ? Math.round((b.completedCount / b.taskCount) * 100) : 0;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}
