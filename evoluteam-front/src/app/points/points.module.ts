import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // ✅ ADD THIS
import { HttpClientModule } from '@angular/common/http'; // ✅ IF NEEDED

import { PointsRoutingModule } from './points-routing.module';
import { PointHistoryListComponent } from './point-history-list/point-history-list.component';

@NgModule({
  declarations: [
    PointHistoryListComponent
  ],
  imports: [
    CommonModule,
    PointsRoutingModule,
    ReactiveFormsModule, // ✅ Fixes formGroup error
    FormsModule,         // Optional: if you use ngModel or template forms
    HttpClientModule     // Optional: if not already globally provided
  ]
})
export class PointsModule { }
