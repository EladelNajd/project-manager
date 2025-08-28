import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamHistory } from '../models/team-history.model';

@Injectable({
  providedIn: 'root'
})
export class TeamHistoryService {
  private apiUrl = '/api/team-history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeamHistory[]> {
    return this.http.get<TeamHistory[]>(this.apiUrl);
  }

  getByTeamId(teamId: number): Observable<TeamHistory[]> {
    return this.http.get<TeamHistory[]>(`${this.apiUrl}/team/${teamId}`);
  }

  create(history: TeamHistory): Observable<TeamHistory> {
    return this.http.post<TeamHistory>(this.apiUrl, history);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
