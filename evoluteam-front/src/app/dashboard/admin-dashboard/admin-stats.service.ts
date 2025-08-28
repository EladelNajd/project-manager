import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

import { User } from '../../models/user.model';
import { Team } from '../../models/team.model';
import { Task } from '../../models/task.model';
import { Project } from '../../projectmanager/project/project.model';

@Injectable({ providedIn: 'root' })
export class AdminStatsService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  // Basic stats methods (existing)
  getTotalUsers(): Observable<number> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() })
      .pipe(map(users => users.length));
  }

  getTotalTeams(): Observable<number> {
    return this.http
      .get<Team[]>(`${this.apiUrl}/teams`, { headers: this.getAuthHeaders() })
      .pipe(map(teams => teams.length));
  }

  getTotalSkills(): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/skills`, { headers: this.getAuthHeaders() })
      .pipe(map(skills => skills.length));
  }

  getPendingSkillRequests(): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/skill-requests`, { headers: this.getAuthHeaders() })
      .pipe(map(reqs => reqs.filter(r => r.status === 'PENDING').length));
  }

  getTotalProjects(): Observable<number> {
    return this.http
      .get<Project[]>(`${this.apiUrl}/projects`, { headers: this.getAuthHeaders() })
      .pipe(map(projects => projects.length));
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() });
  }

  getTotalReviews(): Observable<number> {
    return this.http
      .get<any[]>(`${this.apiUrl}/reviews`, { headers: this.getAuthHeaders() })
      .pipe(map(reviews => reviews.length));
  }

  getPointHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/points`, { headers: this.getAuthHeaders() });
  }

  getTopPerformingUser(): Observable<string> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() }).pipe(
      map(users => {
        if (!users || users.length === 0) return 'N/A';
        const topUser = users.reduce((maxUser, user) =>
          (user.points ?? 0) > (maxUser.points ?? 0) ? user : maxUser
        );
        return topUser.name || 'N/A';
      })
    );
  }

  getTopPerformingTeam(): Observable<string> {
    return forkJoin({
      teams: this.http.get<Team[]>(`${this.apiUrl}/teams`, { headers: this.getAuthHeaders() }),
      users: this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() }),
      tasks: this.http.get<Task[]>(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() }),
      projects: this.http.get<Project[]>(`${this.apiUrl}/projects`, { headers: this.getAuthHeaders() }),
    }).pipe(
      map(({ teams, users, tasks, projects }) => {
        const teamScores = new Map<number, number>();

        teams.forEach(team => {
          const teamUsers = users.filter(u => u.teamId === team.id);
          const totalUserPoints = teamUsers.reduce((sum, user) => sum + (user.points ?? 0), 0);

          const finishedTasks = tasks.filter(task =>
            task.status === 'COMPLETED' &&
            task.assignedUser?.id &&
            teamUsers.some(user => user.id === task.assignedUser?.id)
          ).length;

          const teamProjects = projects.filter(project => project.team?.id === team.id).length;

          const score = totalUserPoints + finishedTasks * 2 + teamProjects * 3;
          teamScores.set(team.id!, score);
        });

        const [topTeamId] = [...teamScores.entries()].reduce(
          (acc, [id, score]) => score > acc[1] ? [id, score] : acc,
          [null, -Infinity] as [number | null, number]
        );

        return teams.find(t => t.id === topTeamId)?.name ?? 'N/A';
      })
    );
  }

  countTasksByStatus(tasks: Task[], status: string): number {
    return tasks.filter(task => task.status === status).length;
  }

  getTaskStatusDistribution(): Observable<{ pending: number; inProgress: number; completed: number }> {
    return this.getAllTasks().pipe(
      map(tasks => ({
        pending: this.countTasksByStatus(tasks, 'PENDING'),
        inProgress: this.countTasksByStatus(tasks, 'IN_PROGRESS'),
        completed: this.countTasksByStatus(tasks, 'COMPLETED'),
      }))
    );
  }

  // ----------- New methods for charts ------------------

  // Bar Chart: Number of Tasks per Project
  getTasksCountByProject(): Observable<{ projectName: string; count: number }[]> {
    return this.http.get<{ projectName: string; count: number }[]>(`${this.apiUrl}/tasks/countByProject`, { headers: this.getAuthHeaders() });
  }

  // Line Chart: Task Completion Over Time (weekly)
  getTaskCompletionOverTime(): Observable<{ week: string; completed: number }[]> {
    return this.http.get<{ week: string; completed: number }[]>(`${this.apiUrl}/tasks/completionOverTime`, { headers: this.getAuthHeaders() });
  }

   getUserSkillLevelsFromRequests(): Observable<{ userName: string; skillLevels: { skillName: string; level: number }[] }[]> {
    // Use the /skill-requests/with-user API
    return this.http.get<any[]>(`${this.apiUrl}/skill-requests/with-user`, { headers: this.getAuthHeaders() }).pipe(
      map(requests => {
        const userSkillsMap = new Map<string, Map<string, number>>();

        requests.forEach(req => {
          // Only count skill requests that awarded points > 0 (assumed skill level)
          if (req.pointsAwarded && req.pointsAwarded > 0) {
            if (!userSkillsMap.has(req.userName)) {
              userSkillsMap.set(req.userName, new Map());
            }
            const skillMap = userSkillsMap.get(req.userName)!;
            const currentLevel = skillMap.get(req.skillName) ?? 0;
            // Store max points awarded per skill per user
            if (req.pointsAwarded > currentLevel) {
              skillMap.set(req.skillName, req.pointsAwarded);
            }
          }
        });

        // Convert Map to array format for chart consumption
        const result: { userName: string; skillLevels: { skillName: string; level: number }[] }[] = [];
        userSkillsMap.forEach((skillsMap, userName) => {
          const skillLevelsArr = Array.from(skillsMap.entries()).map(([skillName, level]) => ({ skillName, level }));
          result.push({ userName, skillLevels: skillLevelsArr });
        });

        return result;
      })
    );
  }

  // Polar Area Chart: Task Priority Distribution
  getTaskPriorityDistribution(): Observable<{ priority: string; count: number }[]> {
    return this.http.get<{ priority: string; count: number }[]>(`${this.apiUrl}/tasks/priorityDistribution`, { headers: this.getAuthHeaders() });
  }

  // Stacked Bar Chart: Task Status per Project
  getTaskStatusPerProject(): Observable<{ projectName: string; pending: number; inProgress: number; completed: number }[]> {
    return this.http.get<{ projectName: string; pending: number; inProgress: number; completed: number }[]>(`${this.apiUrl}/tasks/statusPerProject`, { headers: this.getAuthHeaders() });
  }
}
