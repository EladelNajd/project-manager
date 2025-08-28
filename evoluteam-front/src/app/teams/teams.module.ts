import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TeamsRoutingModule } from './teams-routing.module';

import { TeamListComponent } from './team-list/team-list.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamHistoryComponent } from './team-history/team-history.component';

import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table'; // Import TableModule

@NgModule({
  declarations: [
    TeamListComponent,
    TeamFormComponent,
    TeamHistoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TeamsRoutingModule,
    ToastModule,
    CalendarModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule // Add TableModule here
  ]
})
export class TeamsModule { }
