import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillUpdateRequest } from '../models/skill-update-request.model';

export interface SkillUpdateRequestDTO {
  id: number;
  status: string;
  pointsAwarded: number;
  userName: string;
  skillName: string;
}

@Injectable({ providedIn: 'root' })
export class SkillRequestService {
  private apiUrl = '/api/skill-requests';

  constructor(private http: HttpClient) {}

  // Existing full-entity methods
  getAll(): Observable<SkillUpdateRequest[]> {
    return this.http.get<SkillUpdateRequest[]>(this.apiUrl);
  }

  getById(id: number): Observable<SkillUpdateRequest> {
    return this.http.get<SkillUpdateRequest>(`${this.apiUrl}/${id}`);
  }

  create(request: SkillUpdateRequest): Observable<SkillUpdateRequest> {
    return this.http.post<SkillUpdateRequest>(this.apiUrl, request);
  }

  update(id: number, request: SkillUpdateRequest): Observable<SkillUpdateRequest> {
    return this.http.put<SkillUpdateRequest>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ NEW: DTO-based lightweight read-only list
  getAllWithUser(): Observable<SkillUpdateRequestDTO[]> {
    return this.http.get<SkillUpdateRequestDTO[]>(`${this.apiUrl}/with-user`);
  }
}
