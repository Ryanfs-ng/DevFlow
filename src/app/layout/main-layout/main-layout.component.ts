import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="app-shell" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar (collapseChange)="sidebarCollapsed.set($event)" />
      <div class="main-area">
        <app-topbar [sidebarCollapsed]="sidebarCollapsed()" />
        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
      background: var(--bg-base);
    }

    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-left: var(--sidebar-width);
      transition: margin-left var(--transition-base);
    }

    .sidebar-collapsed .main-area {
      margin-left: 68px;
    }

    .page-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal(false);
}
