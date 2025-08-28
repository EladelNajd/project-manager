import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectHistory } from '../../models/project-history.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectHistoryService {
  private apiUrl = '/api/project-history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProjectHistory[]> {
    return this.http.get<ProjectHistory[]>(this.apiUrl);
  }

  getByProjectId(projectId: number): Observable<ProjectHistory[]> {
    return this.http.get<ProjectHistory[]>(`${this.apiUrl}/project/${projectId}`);
  }

  create(history: ProjectHistory): Observable<ProjectHistory> {
    return this.http.post<ProjectHistory>(this.apiUrl, history);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
