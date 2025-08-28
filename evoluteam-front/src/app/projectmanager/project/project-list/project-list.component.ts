import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Relative import from project-list folder to project.service.ts (one level up)
import { ProjectService } from '../project.service';

// Relative import from project-list folder to teams/team.service.ts (go up 3 levels, then into teams)
import { TeamService } from '../../../teams/team.service';

// Relative import from project-list folder to project.model.ts (one level up)
import { Project } from '../project.model';

// Relative import from project-list folder to models/team.model.ts (go up 3 levels, then into models)
import { Team } from '../../../models/team.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']  // optional
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  teams: Team[] = [];
  teamMap = new Map<number, string>();

  constructor(
    private projectService: ProjectService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;
        // Filter undefined ids before adding to map
        teams
          .filter(t => t.id !== undefined)
          .forEach(t => this.teamMap.set(t.id!, t.name ?? 'Unnamed Team'));
        this.loadProjects();
      },
      error: (err) => console.error('Error loading teams', err)
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (err) => console.error('Error loading projects', err)
    });
  }

  getTeamName(project: Project): string {
    if (project.team?.name) {
      return project.team.name;
    }
    if (project.team?.id !== undefined) {
      return this.teamMap.get(project.team.id) ?? 'Unknown Team';
    }
    return 'No Team';
  }

  deleteProject(id?: number): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.loadProjects(),
        error: (err) => console.error('Error deleting project', err)
      });
    }
  }

  editProject(id?: number): void {
    if (!id) return;
    this.router.navigate(['/projectmanager/projects', id]);
  }

  createProject(): void {
    this.router.navigate(['/projectmanager/projects/new']);
  }
}
