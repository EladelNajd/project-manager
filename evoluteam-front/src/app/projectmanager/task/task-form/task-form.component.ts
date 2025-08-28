import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { TaskService } from '../task.service';
import { MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  providers: [MessageService]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Output() formClosed = new EventEmitter<boolean>();

  taskForm!: FormGroup;
  users: { label: string; value: number }[] = [];
  projects: { label: string; value: number }[] = [];

  statusOptions = [
    { label: 'PENDING', value: 'PENDING' },
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'COMPLETED', value: 'COMPLETED' }
  ];

  todayStr: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.todayStr = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.initializeForm();
    this.loadUsers();
    this.loadProjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && !changes['task'].firstChange) {
      this.patchFormWithTask();
    }
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.minLength(1)]],
      dueDate: ['', Validators.required],
      status: ['PENDING', Validators.required],
      assignedUser: [null, Validators.required],
      project: [null, Validators.required]
    });

    if (this.task) {
      this.patchFormWithTask();
    }
  }

  private patchFormWithTask(): void {
    if (!this.task) return;

    let dueDateValue = '';
    if (this.task.dueDate) {
      const date = new Date(this.task.dueDate);
      if (!isNaN(date.getTime())) {
        dueDateValue = formatDate(date, 'yyyy-MM-dd', 'en-US');
      }
    }

    this.taskForm.patchValue({
      title: this.task.title || '',
      description: this.task.description || '',
      dueDate: dueDateValue,
      status: this.task.status || 'PENDING',
      assignedUser: this.task.assignedUser?.id || null,
      project: this.task.project?.id || null
    });
  }

  loadUsers(): void {
    this.taskService.getUsers().subscribe({
      next: (users) => {
        this.users = users
          .filter(user => user.id != null)
          .map(user => ({
            label: user.name?.trim() || 'Unknown User',
            value: user.id!
          }));

        if (this.users.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'No Users', detail: 'No users found to assign' });
        }
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
      }
    });
  }

  loadProjects(): void {
    this.taskService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects
          .filter(project => project.id != null)
          .map(project => ({
            label: project.title?.trim() || 'Unknown Project',
            value: project.id!
          }));

        if (this.projects.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'No Projects', detail: 'No projects found to assign' });
        }
      },
      error: (err) => {
        console.error('Failed to load projects:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load projects' });
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach(key => this.taskForm.get(key)?.markAsTouched());
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const formValue = this.taskForm.value;

    // Format dueDate for backend LocalDateTime
    let dueDateString = formValue.dueDate;
    if (dueDateString) {
      dueDateString = dueDateString + 'T00:00:00';
    }

    const payload: any = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      dueDate: dueDateString,
      status: formValue.status,
      completed: false
    };

    if (formValue.assignedUser) {
      payload.assignedUser = { id: formValue.assignedUser };
    }

    if (formValue.project) {
      payload.project = { id: formValue.project };
    }

    if (this.task?.id) {
      payload.id = this.task.id;
    }

    const request$ = this.task?.id
      ? this.taskService.updateTask(this.task.id, payload)
      : this.taskService.createTask(payload);

    request$.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.task?.id ? 'Task updated successfully' : 'Task created successfully'
        });
        this.formClosed.emit(true);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving task:', error);
        let detail = 'Failed to save task.';
        if (error.status === 403) {
          detail = 'You are not authorized to perform this action.';
        } else if (error.error?.message) {
          detail = error.error.message;
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  cancel(): void {
    this.formClosed.emit(false);
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.capitalize(fieldName)} is required.`;
      }
      if (field.errors['minlength']) {
        return `${this.capitalize(fieldName)} must not be empty.`;
      }
    }
    return '';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
