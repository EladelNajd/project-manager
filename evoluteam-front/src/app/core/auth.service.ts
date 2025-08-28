import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from 'src/app/models/user.model';

interface AuthResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.setUserFromToken(token);
      this.initializeUserData();
    }
  }

  private initializeUserData(): void {
    setTimeout(() => {
      const token = this.getToken();
      const userId = this.getUserIdFromToken(token!);
      if (userId) {
        this.loadUserFromServer(userId).subscribe({
          next: user => {
            this.setCurrentUser(user);
            console.log('Loaded full user:', user);
          },
          error: err => console.error('Load user failed', err)
        });
      }
    }, 0);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        this.setToken(res.token);
        const userId = this.getUserIdFromToken(res.token);
        if (userId) this.loadUserFromServer(userId).subscribe();
      })
    );
  }

  private loadUserFromServer(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  updateUserOnServer(updatedUser: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${updatedUser.id}`, updatedUser).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.setUserFromToken(token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserIdFromToken(token: string): number | null {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || null;
    } catch {
      return null;
    }
  }

  private setUserFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      const minimalUser: User = {
        id: decoded.id,
        email: decoded.sub,
        role: decoded.role,
        name: '',
        points: 0,
        profileInfo: ''
      };
      this.currentUserSubject.next(minimalUser);
    } catch {
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getRoleFromToken(): string | null {
    return this.currentUserSubject.value?.role || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
  }
}
