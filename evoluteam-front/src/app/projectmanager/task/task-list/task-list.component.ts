
import { TaskService } from '../task.service';
import { Task } from '../../../models/task.model';
import { MessageService } from 'primeng/api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [MessageService],
   encapsulation: ViewEncapsulation.None // Add this line
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  displayDialog = false;

  constructor(
    private taskService: TaskService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: data => {
        this.tasks = data.map(task => ({
          ...task,
          title: task.title ?? '(No title)',
          description: task.description ?? '(No description)',
          status: task.status ?? '(No status)',
          dueDate: task.dueDate ?? null,
          assignedUser: task.assignedUser ?? { id: 0, name: '(Unassigned)' },
          project: task.project ?? { id: 0, title: '(No project)' }
        }));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks'
        });
      }
    });
  }

  openForm(task?: Task): void {
    this.selectedTask = task ? { ...task } : null;
    this.displayDialog = true;
  }
  getStatusClass(status: string): string {
  if (!status) return '';
  
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
  return `status-${normalizedStatus}`;
}

  onFormClose(updated: boolean): void {
    this.displayDialog = false;
    if (updated) this.fetchTasks();
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Task deleted'
        });
        this.fetchTasks();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task'
        });
      }
    });
  }

  // Calculate percentage of tasks by status
  get tasksPendingPercent(): number {
    return this.tasks.length ? (this.tasks.filter(t => t.status === 'PENDING').length / this.tasks.length) * 100 : 0;
  }

  get tasksInProgressPercent(): number {
    return this.tasks.length ? (this.tasks.filter(t => t.status === 'IN_PROGRESS').length / this.tasks.length) * 100 : 0;
  }

  get tasksFinishedPercent(): number {
    return this.tasks.length ? (this.tasks.filter(t => t.status === 'COMPLETED').length / this.tasks.length) * 100 : 0;
  }
  get tasksPendingCount(): number {
  return this.tasks.filter(t => t.status === 'PENDING').length;
}

get tasksInProgressCount(): number {
  return this.tasks.filter(t => t.status === 'IN_PROGRESS').length;
}

get tasksFinishedCount(): number {
  return this.tasks.filter(t => t.status === 'COMPLETED').length;
}

}
