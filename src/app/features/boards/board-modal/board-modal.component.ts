import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Board, User } from '../../../core/models/models';
import { BoardService } from '../../../core/services/board.service';
import { AuthService } from '../../../core/services/auth.service';

const COLOR_PRESETS = ['#6366f1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#A855F7', '#EC4899', '#6B7280'];
const EMOJI_PRESETS = ['📋', '🚀', '💼', '🎯', '✨', '🛠️', '📱', '💡', '🎨', '⚡'];

@Component({
  selector: 'app-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-modal.component.html',
  styleUrl: './board-modal.component.scss'
})
export class BoardModalComponent implements OnInit, OnChanges {
  /** Quando definido, o modal opera em modo edição. */
  @Input() editBoard: Board | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<Board>();
  @Output() updated = new EventEmitter<Board>();

  saving = signal(false);
  errorMsg = signal<string | null>(null);
  members: User[] = [];
  memberIds = new Set<string>();

  name = '';
  description = '';
  color = COLOR_PRESETS[0];
  emoji = EMOJI_PRESETS[0];

  readonly colorPresets = COLOR_PRESETS;
  readonly emojiPresets = EMOJI_PRESETS;

  constructor(
    private boardService: BoardService,
    public auth: AuthService
  ) {}

  get isEdit(): boolean {
    return this.editBoard != null;
  }

  async ngOnInit() {
    this.members = await this.boardService.getUsers();
    this.syncFormFromInput();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editBoard'] && this.members.length) {
      this.syncFormFromInput();
    }
  }

  private syncFormFromInput() {
    if (this.editBoard) {
      this.applyBoard(this.editBoard);
    } else {
      this.resetForm();
    }
  }

  private resetForm() {
    this.name = '';
    this.description = '';
    this.color = COLOR_PRESETS[0];
    this.emoji = EMOJI_PRESETS[0];
    this.memberIds = new Set<string>();
    const uid = this.auth.currentUser()?.id;
    if (uid) this.memberIds.add(uid);
  }

  private applyBoard(b: Board) {
    this.name = b.name;
    this.description = b.description ?? '';
    this.color = b.color || COLOR_PRESETS[0];
    this.emoji = b.emoji || EMOJI_PRESETS[0];
    this.memberIds = new Set(b.members.map(m => m.id));
    const uid = this.auth.currentUser()?.id;
    if (uid) this.memberIds.add(uid);
  }

  toggleMember(id: string) {
    const self = this.auth.currentUser()?.id;
    if (id === self) return;
    if (this.memberIds.has(id)) this.memberIds.delete(id);
    else this.memberIds.add(id);
  }

  isMemberChecked(id: string): boolean {
    return this.memberIds.has(id);
  }

  isSelf(id: string): boolean {
    return id === this.auth.currentUser()?.id;
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  async save() {
    if (!this.name.trim()) return;
    this.errorMsg.set(null);
    this.saving.set(true);
    try {
      const payload = {
        name: this.name,
        description: this.description,
        color: this.color,
        emoji: this.emoji,
        memberIds: [...this.memberIds]
      };
      if (this.editBoard) {
        const board = await this.boardService.updateBoard(this.editBoard.id, payload);
        this.updated.emit(board);
      } else {
        const board = await this.boardService.createBoard(payload);
        this.created.emit(board);
      }
      this.close.emit();
    } catch (e: unknown) {
      let msg = this.isEdit ? 'Não foi possível salvar o board.' : 'Não foi possível criar o board.';
      if (e instanceof HttpErrorResponse) {
        const body = e.error;
        if (typeof body === 'string' && body.length) msg = body;
        else if (body && typeof body === 'object' && 'message' in body && typeof (body as { message: string }).message === 'string') {
          msg = (body as { message: string }).message;
        } else if (e.status === 0) msg = 'Sem conexão com a API.';
        else if (e.status === 401) msg = 'Sessão expirada. Faça login de novo.';
      }
      this.errorMsg.set(msg);
    } finally {
      this.saving.set(false);
    }
  }
}
