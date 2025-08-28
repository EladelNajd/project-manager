import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Import this
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ToastModule } from "primeng/toast";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [
    ProfileEditComponent,
    ProfileViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // <-- Add here
    ProfileRoutingModule,
    ToastModule,
    ButtonModule
]
})
export class ProfileModule { }
