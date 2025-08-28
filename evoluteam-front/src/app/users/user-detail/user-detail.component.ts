import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user?: User;
  loading = false;
  userId?: number;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.userId = id;
        this.loadUser(id);
      } else {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Invalid User ID', 
          detail: 'No valid user ID provided' 
        });
        this.router.navigate(['/users']);
      }
    });
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: user => {
        this.user = user;
        // If user has a team, set teamId for display
        if (user.team && user.team.id) {
          this.user.teamId = user.team.id;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Load Error', 
          detail: error.message || 'Failed to load user details' 
        });
        
        // Navigate back to list if user not found
        if (error.status === 404) {
          setTimeout(() => this.router.navigate(['/users']), 2000);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  onEdit(): void {
    if (this.user) {
      this.router.navigate(['/users/edit', this.user.id]);
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'success';
      case 'TEAM_LEAD': return 'warning';
      case 'USER': return 'info';
      default: return 'secondary';
    }
  }
}