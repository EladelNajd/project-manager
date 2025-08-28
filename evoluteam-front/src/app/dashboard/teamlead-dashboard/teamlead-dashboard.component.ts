import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teamlead-dashboard',
  templateUrl: './teamlead-dashboard.component.html',
  styleUrls: ['./teamlead-dashboard.component.scss'],
})
export class TeamleadDashboardComponent {
  constructor(private router: Router) {}

  navigateToTeamList(): void {
    this.router.navigate(['/users/teamlead-list']); // Adjust the route to point to the Team Lead List component
  }
}
