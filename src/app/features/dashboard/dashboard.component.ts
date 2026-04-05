import { Component, OnInit, signal, computed, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoardService } from '../../core/services/board.service';
import { AuthService } from '../../core/services/auth.service';
import { Task, Board } from '../../core/models/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart')  barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;

  metrics = signal({ total: 0, doing: 0, done: 0, overdue: 0, backlog: 0 });
  recentTasks = signal<Task[]>([]);
  boards = signal<Board[]>([]);

  barChart: Chart | null = null;
  donutChart: Chart | null = null;

  constructor(
    private boardService: BoardService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.metrics.set(this.boardService.getDashboardMetrics());
    this.boards.set(this.boardService.getBoards()().slice(0, 4));
    this.recentTasks.set(
      [...this.boardService.getTasks()()]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6)
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initBarChart();
      this.initDonutChart();
    }, 100);
  }

  private initBarChart() {
    const ctx = this.barChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        datasets: [
          {
            label: 'Concluídas',
            data: [3, 5, 2, 7, 4, 1, 3],
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Em Execução',
            data: [1, 2, 4, 2, 3, 0, 1],
            backgroundColor: 'rgba(245, 158, 11, 0.6)',
            borderRadius: 6,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#9898B3',
              font: { family: 'Inter', size: 12 },
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
              padding: 16,
              usePointStyle: false,
            }
          },
          tooltip: {
            backgroundColor: '#1A1A24',
            borderColor: '#2A2A3D',
            borderWidth: 1,
            titleColor: '#F1F1F8',
            bodyColor: '#9898B3',
            padding: 12,
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#9898B3', font: { family: 'Inter', size: 12 } },
            border: { color: 'transparent' }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#9898B3', font: { family: 'Inter', size: 12 } },
            border: { color: 'transparent' },
            beginAtZero: true
          }
        }
      }
    });
  }

  private initDonutChart() {
    const ctx = this.donutChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const m = this.metrics();

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Finalizado', 'Em Execução', 'A Fazer', 'Backlog', 'Em Revisão'],
        datasets: [{
          data: [m.done, m.doing, 2, m.backlog, 1],
          backgroundColor: ['#10B981', '#F59E0B', '#3B82F6', '#6B7280', '#A855F7'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#9898B3',
              font: { family: 'Inter', size: 12 },
              padding: 12,
              boxWidth: 10,
              boxHeight: 10,
              borderRadius: 3,
            }
          },
          tooltip: {
            backgroundColor: '#1A1A24',
            borderColor: '#2A2A3D',
            borderWidth: 1,
            titleColor: '#F1F1F8',
            bodyColor: '#9898B3',
            padding: 12,
          }
        }
      }
    });
  }

  getPriorityLabel(p: string): string {
    const map: Record<string, string> = {
      low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica'
    };
    return map[p] ?? p;
  }

  getStatusLabel(s: string): string {
    const map: Record<string, string> = {
      backlog: 'Backlog', todo: 'A Fazer', doing: 'Em Execução',
      review: 'Em Revisão', done: 'Finalizado'
    };
    return map[s] ?? s;
  }

  getBoardProgress(b: Board): number {
    return b.taskCount > 0 ? Math.round((b.completedCount / b.taskCount) * 100) : 0;
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}
