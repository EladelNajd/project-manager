import { Component, OnInit } from '@angular/core';
import { SkillRequestService, SkillUpdateRequestDTO } from '../skill-request.service';
import { SkillUpdateRequest } from '../../models/skill-update-request.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-skill-request-list',
  templateUrl: './skill-request-list.component.html',
   styleUrls: ['./skill-request-list.component.scss'],

  providers: [MessageService]
})
export class SkillRequestListComponent implements OnInit {
  requests: SkillUpdateRequestDTO[] = [];
  selectedRequest: SkillUpdateRequest | null = null;
  displayDialog = false;
  isEditMode = false;
  loading = false;

  constructor(
    private requestService: SkillRequestService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestService.getAllWithUser().subscribe({
      next: data => {
        this.requests = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load requests' });
      }
    });
  }

  openNew(): void {
    this.selectedRequest = null;
    this.isEditMode = false;
    this.displayDialog = true;
  }

  editRequest(dto: SkillUpdateRequestDTO): void {
    // You should fetch the full request object by ID here (optional)
    this.requestService.getById(dto.id).subscribe({
      next: data => {
        this.selectedRequest = data;
        this.isEditMode = true;
        this.displayDialog = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch full request' });
      }
    });
  }

  deleteRequest(id: number): void {
    if (confirm('Are you sure you want to delete this request?')) {
      this.requestService.delete(id).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Request deleted' });
          this.loadRequests();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
        }
      });
    }
  }

  onDialogSave(request: SkillUpdateRequest): void {
    if (this.isEditMode && request.id) {
      this.requestService.update(request.id, request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Request updated' });
          this.displayDialog = false;
          this.loadRequests();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
      });
    } else {
      this.requestService.create(request).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Request created' });
          this.displayDialog = false;
          this.loadRequests();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Creation failed' });
        }
      });
    }
  }

  onDialogCancel(): void {
    this.displayDialog = false;
  }
}
