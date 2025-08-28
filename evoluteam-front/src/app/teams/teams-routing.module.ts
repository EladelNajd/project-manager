import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamHistoryComponent } from './team-history/team-history.component';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  {
    path: '',
    component: TeamListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: 'add',
    component: TeamFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'edit/:id',
    component: TeamFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: 'history', // Shows all team history
    component: TeamHistoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: ':teamId/history', // Shows history for a specific team
    component: TeamHistoryComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule {}
