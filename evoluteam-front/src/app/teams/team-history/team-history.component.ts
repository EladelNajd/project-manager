import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamHistoryService } from '../team-history.service';
import { TeamService } from '../team.service'; // Import TeamService
import { TeamHistory } from '../../models/team-history.model';
import { Team } from '../../models/team.model'; // Import Team model
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-team-history',
  templateUrl: './team-history.component.html',
  styleUrls: ['./team-history.component.scss']
})
export class TeamHistoryComponent implements OnInit {
  teamId?: number;
  history: TeamHistory[] = [];
  teams: Team[] = []; // Array to hold teams
  newChange: string = '';
  newDate?: Date;
  selectedTeamId?: number; // Property to hold selected team ID

  constructor(
    private route: ActivatedRoute,
    private historyService: TeamHistoryService,
    private teamService: TeamService, // Inject TeamService
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('teamId');
      if (id) {
        this.teamId = +id;
        this.loadHistoryByTeam();
      } else {
        this.loadAllHistory();
      }
    });
    this.loadTeams(); // Load teams when the component initializes
  }

  loadTeams(): void {
    this.teamService.getAll().subscribe({
      next: data => this.teams = data, // Assign teams to the local array
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams' })
    });
  }

  loadAllHistory(): void {
    this.historyService.getAll().subscribe({
      next: data => this.history = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load history' })
    });
  }

  loadHistoryByTeam(): void {
    if (!this.teamId) return;
    this.historyService.getByTeamId(this.teamId).subscribe({
      next: data => this.history = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load team history' })
    });
  }

  createHistory(): void {
    if (!this.newChange.trim() || !this.selectedTeamId) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Change description and team selection required' });
      return;
    }

    // Fetch the team name based on the selected team ID
    const selectedTeam = this.teams.find(team => team.id === this.selectedTeamId);
    const teamName = selectedTeam ? selectedTeam.name : '';

    const newEntry: TeamHistory = {
      event: this.newChange.trim(),
      team: { id: this.selectedTeamId }, // Use selected team ID
      teamName: teamName, // Set the team name
      date: this.newDate ? this.newDate.toISOString() : undefined
    };

    this.historyService.create(newEntry).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Created', detail: 'History entry added' });
        this.newChange = '';
        this.newDate = undefined;
        this.selectedTeamId = undefined; // Reset selected team
        this.teamId ? this.loadHistoryByTeam() : this.loadAllHistory();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not add history entry' });
      }
    });
  }

  deleteHistory(id: number): void {
    if (confirm('Delete this history entry?')) {
      this.historyService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'History entry deleted' });
          this.teamId ? this.loadHistoryByTeam() : this.loadAllHistory();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not delete history entry' });
        }
      });
    }
  }
}
