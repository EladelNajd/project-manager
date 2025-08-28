import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../review.service';
import { UserService } from '../../users/user.service';
import { AuthService } from '../../core/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  providers: [MessageService]  // Provide MessageService here if you want isolated messages, else provide it in a shared module
})
export class ReviewFormComponent implements OnInit {
  @Output() formClosed = new EventEmitter<boolean>();

  reviewForm!: FormGroup;
  users: { label: string; value: number }[] = [];
  currentUser: User | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Get current logged-in user info
    this.currentUser = this.authService.getCurrentUser();

    // Initialize form group
    this.reviewForm = this.fb.group({
      user: [null, Validators.required],        // The user being reviewed (reviewee)
      reviewer: [this.currentUser?.id || null], // The reviewer (current user)
      content: ['', Validators.required]        // Review content
    });

    // Load users to select from, excluding current user
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users
          .filter(u => u.id !== this.currentUser?.id)  // exclude self from reviewees
          .map(u => ({
            label: u.name || 'Unnamed User',
            value: u.id
          }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  onSubmit(): void {
    // Validate form before submit
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) return;  // prevent double submit
    this.isSubmitting = true;

    // Prepare payload matching expected API format
    const payload = {
      user: { id: this.reviewForm.value.user },
      reviewer: { id: this.currentUser!.id },
      content: this.reviewForm.value.content.trim()
    };

    this.reviewService.createReview(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Review Submitted',
          detail: 'Your review was submitted successfully'
        });
        this.isSubmitting = false;

        // Emit event to parent to indicate form closed with success
        this.formClosed.emit(true);

        // Reset form, keep reviewer field prefilled
        this.reviewForm.reset({ reviewer: this.currentUser!.id });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: err?.message || 'Could not submit review'
        });
      }
    });
  }

  cancel(): void {
    // Emit event to notify parent the form was cancelled/closed without saving
    this.formClosed.emit(false);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.reviewForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
