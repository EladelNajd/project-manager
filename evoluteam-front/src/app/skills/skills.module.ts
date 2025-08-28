import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkillsRoutingModule } from './skills-routing.module';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillFormComponent } from './skill-form/skill-form.component';
import { SkillRequestListComponent } from './skill-request-list/skill-request-list.component';
import { SkillRequestFormComponent } from './skill-request-form/skill-request-form.component';

// PrimeNG modules
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

// PrimeNG services
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    SkillListComponent,
    SkillFormComponent,
    SkillRequestListComponent,
    SkillRequestFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkillsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG UI modules
    ToastModule,
    DialogModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    TableModule
  ],
  providers: [
    MessageService
  ]
})
export class SkillsModule { }