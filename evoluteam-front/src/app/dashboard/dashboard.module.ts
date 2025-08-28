import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { TeamleadDashboardComponent } from './teamlead-dashboard/teamlead-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart'; // ✅ import ChartModule
import { NgChartsModule } from 'ng2-charts';  // <-- ADD this import

@NgModule({
  declarations: [
    AdminDashboardComponent,
    TeamleadDashboardComponent,
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    ChartModule,
    ProgressBarModule,
    NgChartsModule,  // <-- ADD this here
  ],
  exports: [
    AdminDashboardComponent,
    TeamleadDashboardComponent,
    UserDashboardComponent
  ]
})
export class DashboardModule {}
