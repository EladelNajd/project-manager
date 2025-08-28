import { Component, OnInit } from '@angular/core';
import { ReviewService, Review } from '../review.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  displayDialog: boolean = false; // control dialog visibility

  constructor(private reviewService: ReviewService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: res => this.reviews = res,
      error: err => {
        console.error('Error fetching reviews', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to load reviews'});
      }
    });
  }

  deleteReview(id: number) {
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.messageService.add({severity: 'success', summary: 'Deleted', detail: 'Review deleted successfully'});
      },
      error: () => {
        this.messageService.add({severity: 'error', summary: 'Delete Failed', detail: 'Could not delete review'});
      }
    });
  }

  openDialog() {
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }

  onFormClosed(saved: boolean) {
    this.closeDialog();
    if (saved) {
      this.loadReviews();
      this.messageService.add({
        severity: 'success',
        summary: 'Review Submitted',
        detail: 'Your review was submitted successfully'
      });
    }
  }
}
