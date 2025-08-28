import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PrimeIcons } from 'primeng/api'; // Import PrimeIcons

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Load Error',
          detail: error.message || 'Failed to load users'
        });
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/users/add']);
  }

  onEdit(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  onView(user: User): void {
    this.router.navigate(['/users', user.id]);
  }

  onDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userService.deleteUser (user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User  ${user.name} has been deleted successfully`
            });
            this.loadUsers();
          },
          error: (error) => {
            let backendMessage = 'Failed to delete user';
            if (typeof error.error === 'string') {
              backendMessage = error.error;
            } else if (error.error && typeof error.error === 'object') {
              backendMessage =
                error.error.message ||
                error.error.error ||
                error.error.detail ||
                backendMessage;
            } else if (error.message) {
              backendMessage = error.message;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: backendMessage
            });

            if (error.status === 404) {
              this.loadUsers();
            }
          }
        });
      },
      reject: () => {
        // No action needed on cancel
      }
    });
  }
}
