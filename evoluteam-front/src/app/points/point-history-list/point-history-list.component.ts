import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointHistoryService, PointHistory } from '../point-history.service';
import { User } from '../../models/user.model';  // Adjust this path if needed

@Component({
  selector: 'app-point-history-list',
  templateUrl: './point-history-list.component.html',
  styleUrls: ['./point-history-list.component.scss']
})
export class PointHistoryListComponent implements OnInit {
  pointHistories: PointHistory[] = [];
  users: User[] = [];
  addForm!: FormGroup;

  // Map userId to userName for quick lookup in template
  userMap = new Map<number, string>();

  constructor(
    private phService: PointHistoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      userId: ['', Validators.required],
      points: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required]
    });

    this.loadData();
  }

  loadData() {
    // Load users first to build the map
    this.phService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.userMap.clear();
        this.users.forEach(u => {
          if (u.id != null && u.name) {
            this.userMap.set(u.id, u.name);
          }
        });
      },
      error: (err) => console.error('Error loading users', err)
    });

    // Load point histories
    this.phService.getPointHistories().subscribe({
      next: (data) => this.pointHistories = data,
      error: (err) => console.error('Error loading point histories', err)
    });
  }

  onSubmit() {
    if (this.addForm.invalid) return;

    const formValue = this.addForm.value;

    const newHistory: PointHistory = {
      points: formValue.points,
      reason: formValue.reason,
      user: { id: +formValue.userId }
    };

    this.phService.addPointHistory(newHistory).subscribe({
      next: () => {
        this.addForm.reset();
        this.loadData();
      },
      error: (error) => {
        console.error('Add point history failed', error);
        alert('Failed to add point history. Check console for details.');
      }
    });
  }

  // Safe method to get user name by ID
  getUserName(userId?: number): string {
    if (userId == null) return 'Unknown User';
    return this.userMap.get(userId) ?? 'Unknown User';
  }
}
