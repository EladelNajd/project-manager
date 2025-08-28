import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SkillUpdateRequest } from '../../models/skill-update-request.model';
import { User } from '../../models/user.model';
import { Skill } from '../../models/skill.model';

import { SkillService } from '../../skills/skill.service';
import { UserService } from '../../users/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-skill-request-form',
  templateUrl: './skill-request-form.component.html',
  styleUrls: ['./skill-request-form.component.scss'],
})
export class SkillRequestFormComponent implements OnInit, OnChanges {
  @Input() existingRequest: SkillUpdateRequest | null = null;
  @Input() editing = false;

  @Output() save = new EventEmitter<SkillUpdateRequest>();
  @Output() cancel = new EventEmitter<void>();

  skillRequestForm!: FormGroup;

  users: User[] = [];
  skills: Skill[] = [];
  statuses: string[] = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
    this.loadSkills();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.skillRequestForm && changes['existingRequest']) {
      if (this.existingRequest) {
        this.patchForm(this.existingRequest);
      } else {
        this.skillRequestForm.reset({
          status: 'PENDING',
          pointsAwarded: 0,
          reason: '',
          user: null,
          skill: null,
        });
      }
    }
  }

  initForm(): void {
    this.skillRequestForm = this.fb.group({
      user: [null, Validators.required],
      skill: [null, Validators.required],
      status: ['PENDING', Validators.required],
      pointsAwarded: [0, [Validators.required, Validators.min(0)]],
      reason: [''],
    });

    if (this.existingRequest) {
      this.patchForm(this.existingRequest);
    }
  }

  patchForm(request: SkillUpdateRequest): void {
    // Patch form with existing request values
    this.skillRequestForm.patchValue({
      user: request.user ?? null,
      skill: request.skill ?? null,
      status: request.status,
      pointsAwarded: request.pointsAwarded,
      reason: request.reason ?? '',
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        if (this.existingRequest) this.patchForm(this.existingRequest);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        }),
    });
  }

  loadSkills(): void {
    this.skillService.getAllSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
        if (this.existingRequest) this.patchForm(this.existingRequest);
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load skills',
        }),
    });
  }

  onSubmit(): void {
    if (this.skillRequestForm.invalid) {
      this.skillRequestForm.markAllAsTouched();
      return;
    }

    const formValue = this.skillRequestForm.value;

    const request: SkillUpdateRequest = {
      id: this.existingRequest?.id,
      status: formValue.status,
      pointsAwarded: formValue.pointsAwarded,
      reason: formValue.reason,
      user: formValue.user,
      skill: formValue.skill,
    };

    this.save.emit(request);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get f() {
    return this.skillRequestForm.controls;
  }
}
