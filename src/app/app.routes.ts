import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Auth (sem layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },

  // App com Layout principal
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'boards',
        loadComponent: () => import('./features/boards/boards.component').then(m => m.BoardsComponent)
      },
      {
        path: 'board/:id',
        loadComponent: () => import('./features/board/board.component').then(m => m.BoardComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent)
      },
      {
        path: 'team',
        loadComponent: () => import('./features/team/team.component').then(m => m.TeamComponent)
      }
    ]
  },

  { path: '**', redirectTo: '/dashboard' }
];
