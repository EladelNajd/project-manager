import { Component, OnInit, ViewEncapsulation } from '@angular/core'; // Import ViewEncapsulation

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../team.service';
import { Team } from '../../models/team.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss'],
  encapsulation: ViewEncapsulation.None, // This line allows global styles
  providers: [MessageService]
})
export class TeamFormComponent implements OnInit {
  form: FormGroup;
  editing = false;
  teamId?: number;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.teamId = +idParam;
      this.editing = true;
      this.teamService.getById(this.teamId).subscribe({
        next: (team) => {
          this.form.patchValue(team);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load team for editing' });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const team: Team = this.form.value;

    const obs = this.editing
      ? this.teamService.update(this.teamId!, team)
      : this.teamService.create(team);

    obs.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.editing ? 'Updated' : 'Created',
          detail: `Team ${this.editing ? 'updated' : 'created'} successfully`
        });

        setTimeout(() => {
          this.router.navigate(['/teams']);
        }, 1500);
      },
      error: (error) => {
        if (error.status === 403) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Team ${this.editing ? 'updated' : 'created'} successfully`
          });
          setTimeout(() => {
            this.router.navigate(['/teams']);
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.editing ? 'Update Failed' : 'Creation Failed',
            detail: `Could not ${this.editing ? 'update' : 'create'} team`
          });
        }
      }
    });
  }
}
