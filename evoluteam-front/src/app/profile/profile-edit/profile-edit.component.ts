// src/app/profile-edit/profile-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  providers: [MessageService] // Provide MessageService here
})
export class ProfileEditComponent implements OnInit {
  user: User = {} as User;
  loading = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = { ...currentUser };
    }
  }

  save(): void {
    if (!this.user.name?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Name is required',
        life: 3000
      });
      return;
    }

    this.loading = true;
    
    this.authService.updateUserOnServer(this.user).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully!',
          life: 3000
        });
        
        // Navigate after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(['/profile/view']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: 'Please try again.',
          life: 3000
        });
      }
    });
  }
}