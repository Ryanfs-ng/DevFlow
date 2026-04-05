import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = signal('ryan@devflow.com');
  password = signal('devflow123');
  loading = signal(false);
  error = signal('');
  showPass = signal(false);

  constructor(private auth: AuthService, private router: Router) { }

  async onSubmit() {
    if (this.loading()) return;
    this.error.set('');
    this.loading.set(true);
    try {
      await this.auth.login({ email: this.email(), password: this.password() });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao fazer login');
    } finally {
      this.loading.set(false);
    }
  }

  togglePass() { this.showPass.update(v => !v); }
}
