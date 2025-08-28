import { Component, OnInit } from '@angular/core';
import { ProjectHistoryService } from '../project-history.service';
import { ProjectHistory } from '../../../models/project-history.model';
import { MessageService } from 'primeng/api';
import { Project } from '../../project/project.model';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-project-history-list',
  templateUrl: './project-history-list.component.html',
  styleUrls: ['./project-history-list.component.scss'],
  providers: [MessageService]
})
export class ProjectHistoryListComponent implements OnInit {
  histories: ProjectHistory[] = [];
  projects: Project[] = [];
  loading = false;

  constructor(
    private historyService: ProjectHistoryService,
    private projectService: ProjectService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.fetchHistories(); // wait until we have projects
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load projects' });
      }
    });
  }

  fetchHistories(): void {
    this.loading = true;
    this.historyService.getAll().subscribe({
      next: (data) => {
        this.histories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load project history' });
      }
    });
  }

  getProjectName(projectId: number | undefined): string {
  if (projectId == null) return 'N/A';  // handles both null & undefined
  const project = this.projects.find(p => p.id === projectId);
  return project?.title || project?.name || `Project #${projectId}`;
}


  deleteHistory(id: number): void {
    if (confirm('Are you sure you want to delete this history record?')) {
      this.historyService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'History deleted' });
          this.fetchHistories();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
        }
      });
    }
  }
}
