import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectmanagerRoutingModule } from './projectmanager-routing.module';

import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { ProjectHistoryListComponent } from './project-history/project-history-list/project-history-list.component';
import { ProjectHistoryFormComponent } from './project-history/project-history-form/project-history-form.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { TaskFormComponent } from './task/task-form/task-form.component';



// PrimeNG modules
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';  // <-- ADD THIS

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from "primeng/confirmdialog";

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectFormComponent,
    ProjectHistoryListComponent,
    ProjectHistoryFormComponent,
    TaskListComponent,
    TaskFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressBarModule,
    ProjectmanagerRoutingModule,
    ToastModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ConfirmDialogModule
]
})
export class ProjectmanagerModule { }
