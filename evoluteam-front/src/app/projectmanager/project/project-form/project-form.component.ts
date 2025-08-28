import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../../teams/team.service'; // ✅ keep same structure

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'] 


})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode = false;
  projectId?: number;
teams: any;

  constructor(
  private fb: FormBuilder,
  private projectService: ProjectService,
  private route: ActivatedRoute,
  private router: Router,
  private teamService: TeamService // ✅ add this
) {}

ngOnInit(): void {
  this.projectForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    teamId: [null]
  });

  this.loadTeams(); // ✅ here

  this.route.params.subscribe(params => {
    if (params['id']) {
      this.isEditMode = true;
      this.projectId = +params['id'];
      this.loadProject(this.projectId);
    }
  });
}


  loadProject(id: number): void {
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          title: project.title,
          description: project.description,
          teamId: project.team?.id || null
        });
      },
      error: (err) => console.error(err)
    });
  }
  loadTeams(): void {
  this.teamService.getAll().subscribe({
    next: (teams) => this.teams = teams,
    error: (err) => console.error('Error loading teams', err)
  });
}

onSubmit(): void {
  if (this.projectForm.invalid) return;

  const formValue = this.projectForm.value;
  const project: Project = {
    name: formValue.title,  // <-- REQUIRED field added here
    title: formValue.title,
    description: formValue.description,
    team: formValue.teamId ? { id: formValue.teamId } : undefined
  };

  if (this.isEditMode && this.projectId) {
    this.projectService.updateProject(this.projectId, project).subscribe(() => {
      this.router.navigate(['/projectmanager/projects']);
    });
  } else {
    this.projectService.createProject(project).subscribe(() => {
      this.router.navigate(['/projectmanager/projects']);
    });
  }
}

}
