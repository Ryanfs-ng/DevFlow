import { Injectable, signal } from '@angular/core';
import { User, AuthCredentials, AuthResponse } from '../models/models';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ryan Ferreira',
    email: 'ryan@devflow.com',
    initials: 'RF',
    role: 'admin',
    color: '#6366F1'
  },
  {
    id: '2',
    name: 'Pedro Paulo',
    email: 'pedro@devflow.com',
    initials: 'PP',
    role: 'developer',
    color: '#22D3EE'
  },
  {
    id: '3',
    name: 'João',
    email: 'joao@devflow.com',
    initials: 'JV',
    role: 'designer',
    color: '#10B981'
  },
  {
    id: '4',
    name: 'Enzo Gabriel',
    email: 'enzo@devflow.com',
    initials: 'EG',
    role: 'qa',
    color: '#F59E0B'
  },
  {
    id: '5',
    name: 'Felipe de Moura',
    email: 'felipe@devflow.com',
    initials: 'FM',
    role: 'manager',
    color: '#A855F7'
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'devflow_token';
  private readonly USER_KEY = 'devflow_user';

  currentUser = signal<User | null>(this.loadUser());
  isAuthenticated = signal<boolean>(!!this.loadToken());

  login(credentials: AuthCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === credentials.email);

        if (user && credentials.password === 'devflow123') {
          const mockToken = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
          const response: AuthResponse = {
            token: mockToken,
            user,
            expiresIn: 86400
          };

          localStorage.setItem(this.TOKEN_KEY, mockToken);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
          resolve(response);
        } else {
          reject(new Error('E-mail ou senha inválidos'));
        }
      }, 800); // simula latência de rede
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getMockUsers(): User[] {
    return MOCK_USERS;
  }
}
