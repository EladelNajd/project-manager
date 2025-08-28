import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Team } from '../models/team.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:8080/api/teams'; // full URL to backend

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // adjust if stored elsewhere
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  create(team: Team): Observable<Team> {
    return this.http.post<Team>(this.baseUrl, team, { headers: this.getAuthHeaders() });
  }

  update(id: number, team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.baseUrl}/${id}`, team, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
