import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ReviewsRoutingModule } from './reviews-routing.module';

import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewFormComponent } from './review-form/review-form.component';

// PrimeNG Modules needed
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from "primeng/dialog";

@NgModule({
  declarations: [
    ReviewListComponent,
    ReviewFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReviewsRoutingModule,
    DropdownModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    DialogModule
]
})
export class ReviewsModule { }
