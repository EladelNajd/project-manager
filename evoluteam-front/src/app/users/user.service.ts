import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  name: string;
  profileInfo: string;
  role: string;
  teamId?: number;
  points?: number;
  password?: string; // Made optional since it's not always needed
  team?: {
    id: number;
    name?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    console.log('Token being used:', token ? 'Present' : 'Missing');
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('HTTP Error:', error);
    
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      const backendMessage = error.error?.message ||
                             error.error?.error ||
                             error.error?.detail ||
                             error.message;

      switch (error.status) {
        case 400:
          errorMessage = backendMessage || 'Bad request - invalid data provided';
          break;
        case 401:
          errorMessage = 'Unauthorized - please login again';
          break;
        case 403:
          errorMessage = backendMessage || 'Access denied - insufficient permissions for this operation';
          break;
        case 404:
          errorMessage = backendMessage || 'User not found';
          break;
        case 409:
          errorMessage = backendMessage || 'Conflict - user already exists or data conflict';
          break;
        case 422:
          errorMessage = backendMessage || 'Cannot delete user with linked data (reviews, requests, or points)';
          break;
        case 500:
          errorMessage = backendMessage || 'Internal server error';
          break;
        default:
          errorMessage = backendMessage || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error
    }));
  }

  getAllUsers(): Observable<User[]> {
    console.log('Getting all users...');
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<User> {
    console.log(`Getting user by ID: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  createUser(user: any): Observable<User> {
    console.log('Creating user:', user);
    
    // ✅ FIXED: Build the user object properly for backend
    const userToSend: any = {
      name: user.name,
      email: user.email,
      profileInfo: user.profileInfo,
      role: user.role
    };

    // ✅ FIXED: Handle team assignment - send team object with id
    if (user.team && user.team.id) {
      userToSend.team = { id: user.team.id };
    } else if (user.teamId) {
      userToSend.team = { id: user.teamId };
    }

    // Handle password - required for new users
    if (!user.password || user.password.trim() === '') {
      return throwError(() => ({ message: 'Password is required for new users' }));
    }
    userToSend.password = user.password;

    console.log('Final user data being sent to backend:', userToSend);

    return this.http.post<User>(this.apiUrl, userToSend, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: any): Observable<User> {
    console.log(`Updating user ${id}:`, user);
    
    // ✅ FIXED: Build the user object properly for backend
    const userToSend: any = {
      name: user.name,
      email: user.email,
      profileInfo: user.profileInfo,
      role: user.role
    };

    // ✅ FIXED: Handle team assignment - send team object with id
    if (user.team && user.team.id) {
      userToSend.team = { id: user.team.id };
    } else if (user.teamId) {
      userToSend.team = { id: user.teamId };
    } else {
      // Explicitly set team to null if no team selected
      userToSend.team = null;
    }

    // Handle password - only include if provided and not empty
    if (user.password && user.password.trim() !== '') {
      userToSend.password = user.password;
    }

    console.log('Final user data being sent to backend:', userToSend);

    return this.http.put<User>(`${this.apiUrl}/${id}`, userToSend, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<string> {
    console.log(`Deleting user ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to delete user';

        if (typeof error.error === 'string' && error.error.trim() !== '') {
          errorMessage = error.error;
        } else if (error.error && typeof error.error === 'object') {
          errorMessage =
            error.error.message ||
            error.error.error ||
            error.error.detail ||
            errorMessage;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          originalError: error
        }));
      })
    );
  }

  getCurrentUser(): Observable<User> {
    console.log('Getting current user...');
    return this.http.get<User>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
}