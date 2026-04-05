import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs';

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/boards':    'Meus Boards',
  '/tasks':     'Todas as Tarefas',
  '/team':      'Equipe',
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  @Input() sidebarCollapsed = false;

  pageTitle = 'Dashboard';

  constructor(private router: Router, public auth: AuthService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const base = '/' + e.urlAfterRedirects.split('/')[1];
        this.pageTitle = ROUTE_TITLES[base] ?? 'DevFlow';
      });
  }
}
