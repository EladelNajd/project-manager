import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';

// PrimeNG imports
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserListUserbasedComponent } from './user-list-userbased/user-list-userbased.component';
import { TeamleadFormComponent } from './teamlead-form/teamlead-form.component';
import { TeamleadListComponent } from './teamlead-list/teamlead-list.component';
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailComponent,
    UserListUserbasedComponent,
    TeamleadFormComponent,
    TeamleadListComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ToastModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CardModule,
    MessageModule,
    ProgressSpinnerModule,
    TagModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class UsersModule { }
