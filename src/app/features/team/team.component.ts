import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../core/services/board.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="team-page">
    <div class="team-header">
      <div>
        <h1>Nossa Equipe</h1>
        <p>{{ members.length }} membros ativos</p>
      </div>
      <button class="btn btn-primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
        Convidar Membro
      </button>
    </div>

    <div class="members-grid">
      @for (m of members; track m.id; let i = $index) {
        <div class="member-card animate-fade-in" [class]="'stagger-' + (i+1)">
          <div class="member-card-top" [style.background]="m.color + '15'">
            <div class="member-avatar-lg" [style.background]="m.color">{{ m.initials }}</div>
          </div>
          <div class="member-card-body">
            <h3>{{ m.name }}</h3>
            <span class="member-role">{{ getRoleLabel(m.role) }}</span>
            <p class="member-email">{{ m.email }}</p>
          </div>
          <div class="member-card-stats">
            <div class="member-stat">
              <span class="stat-val">{{ getTaskCount(m.id) }}</span>
              <span class="stat-lbl">Tarefas</span>
            </div>
            <div class="member-stat">
              <span class="stat-val">{{ getDoneCount(m.id) }}</span>
              <span class="stat-lbl">Concluídas</span>
            </div>
          </div>
          <div class="member-card-footer">
            <button class="btn btn-ghost btn-sm w-full">Ver Perfil</button>
          </div>
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .team-page { padding: var(--space-8); }
    .team-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: var(--space-8);
      h1 { font-size: 26px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; margin-bottom: 4px; }
      p  { font-size: 14px; color: var(--text-secondary); }
    }
    .members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4); }
    .member-card {
      background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden; transition: all var(--transition-base);
      &:hover { border-color: var(--border-accent); box-shadow: var(--shadow-md); transform: translateY(-2px); }
    }
    .member-card-top {
      padding: 28px 20px 16px; display: flex; justify-content: center;
    }
    .member-avatar-lg {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; font-weight: 800; color: #fff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }
    .member-card-body {
      padding: 0 20px 16px; text-align: center;
      h3 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
    }
    .member-role {
      display: inline-flex; padding: 3px 10px; border-radius: var(--radius-full);
      font-size: 11px; font-weight: 600; background: var(--bg-elevated); color: var(--text-secondary);
      text-transform: capitalize; margin-bottom: 8px;
    }
    .member-email { font-size: 12px; color: var(--text-muted); }
    .member-card-stats {
      display: grid; grid-template-columns: 1fr 1fr;
      border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);
    }
    .member-stat {
      padding: 12px; text-align: center;
      &:first-child { border-right: 1px solid var(--border-subtle); }
    }
    .stat-val { display: block; font-size: 20px; font-weight: 800; color: var(--text-primary); line-height: 1; margin-bottom: 2px; }
    .stat-lbl { font-size: 11px; color: var(--text-muted); }
    .member-card-footer { padding: 12px 16px; }
    .w-full { width: 100%; justify-content: center; }
  `]
})
export class TeamComponent {
  members: User[] = [];

  constructor(private boardService: BoardService) {
    this.members = this.boardService.getMockUsers();
  }

  getRoleLabel(r: string): string {
    const m: Record<string, string> = {
      admin: 'Administrador', developer: 'Desenvolvedor',
      designer: 'Designer', manager: 'Gerente', qa: 'QA'
    };
    return m[r] ?? r;
  }

  getTaskCount(uid: string): number {
    return this.boardService.getTasks()().filter(t => t.assignees.some(a => a.id === uid)).length;
  }

  getDoneCount(uid: string): number {
    return this.boardService.getTasks()().filter(t => t.assignees.some(a => a.id === uid) && t.status === 'done').length;
  }
}
