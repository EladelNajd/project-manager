import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TeamleadDashboardComponent } from './teamlead-dashboard/teamlead-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'teamlead',
    component: TeamleadDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['TEAM_LEAD'] }
  },
  {
    path: 'user',
    component: UserDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['USER'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}