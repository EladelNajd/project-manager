import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { Team } from '../../models/team.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
  providers: [MessageService]
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  form: FormGroup;
  editing: boolean = false;
  teamDialogVisible: boolean = false;
  currentTeamId?: number;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe({
      next: (data) => {
        this.teams = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams' });
      }
    });
  }

  openCreateDialog(): void {
    this.editing = false;
    this.currentTeamId = undefined;
    this.form.reset();
    this.teamDialogVisible = true;
  }

  openEditDialog(team: Team): void {
    this.editing = true;
    this.currentTeamId = team.id;
    this.form.patchValue(team);
    this.teamDialogVisible = true;
  }

  closeDialog(): void {
    this.teamDialogVisible = false;
    this.form.reset();
  }

onSubmit(): void {
    if (this.form.invalid) return; // Prevent submission if the form is invalid

    const team: Team = this.form.value; // Get the team data from the form
    console.log('Creating team:', team); // Log the team object

    const request = this.editing
        ? this.teamService.update(this.currentTeamId!, team) // Update existing team
        : this.teamService.create(team); // Create new team

    request.subscribe({
        next: () => {
            this.messageService.add({
                severity: 'success',
                summary: this.editing ? 'Updated' : 'Created',
                detail: `Team ${this.editing ? 'updated' : 'created'} successfully`
            });
            this.closeDialog(); // Close the dialog
            this.loadTeams(); // Reload the teams
        },
        error: (err) => {
            console.error(err); // Log the error for debugging
            this.messageService.add({
                severity: 'error',
                summary: this.editing ? 'Update Failed' : 'Create Failed',
                detail: `Could not ${this.editing ? 'update' : 'create'} team: ${err.message}`
            });
        }
    });
}



  deleteTeam(id: number): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamService.delete(id).subscribe({
        next: () => {
          this.loadTeams();
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Team deleted successfully' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team' });
        }
      });
    }
  }
}
