// project-history-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectHistoryService } from '../project-history.service';
import { ProjectService } from '../../project/project.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Project } from '../../project/project.model';

@Component({
  selector: 'app-project-history-form',
  templateUrl: './project-history-form.component.html',
  styleUrls: ['./project-history-form.component.scss'],
  providers: [MessageService]
})
export class ProjectHistoryFormComponent implements OnInit {
  form!: FormGroup;
  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private historyService: ProjectHistoryService,
    private projectService: ProjectService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      projectId: [null, Validators.required],
      event: ['', Validators.required],
      date: [new Date().toISOString().substring(0, 10), Validators.required]
    });

    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.error('Failed to load projects', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load projects' });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const isoDate = new Date(formValue.date).toISOString();

    const payload = {
      event: formValue.event,
      date: isoDate,
      project: {
        id: formValue.projectId
      }
    };

    this.historyService.create(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Project history created' });
        this.router.navigate(['/projectmanager/project-history']);
      },
      error: (err) => {
        console.error('Create error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create history' });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/projectmanager/project-history']);
  }
}
