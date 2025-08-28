import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';  // <-- Correct relative path

export interface PointHistory {
  id?: number;
  user?: Partial<User>;
  points: number;
  reason: string;
  date?: string;
  givenBy?: Partial<User>;  // <--- add this!
}
@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private apiUrl = 'http://localhost:8080/api/points';  // fixed URL
  private usersUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getPointHistories(): Observable<PointHistory[]> {
    return this.http.get<PointHistory[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addPointHistory(ph: PointHistory): Observable<PointHistory> {
    return this.http.post<PointHistory>(this.apiUrl, ph, { headers: this.getAuthHeaders() });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, { headers: this.getAuthHeaders() });
  }
}
