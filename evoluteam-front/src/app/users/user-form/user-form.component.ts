import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User, UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId?: number;
  isEditMode = false;
  loading = false;
  originalUser?: User;
  teams: any[] = []; // ✅ Keep as any[] for now
  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    { label: 'Team Lead', value: 'TEAM_LEAD' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private http: HttpClient, // ✅ Inject HttpClient instead
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadTeams(); // ✅ Load actual teams from backend
    this.handleRouteParams();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      profileInfo: [''],
      role: ['', Validators.required],
      teamId: [null], // This will hold the selected team ID
      points: [0],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private loadTeams(): void {
    // ✅ Load teams directly from backend API
    this.http.get<any[]>('http://localhost:8080/api/teams').subscribe({
      next: (teams) => {
        this.teams = teams;
        console.log('Loaded teams:', this.teams); // Debug log
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Could not load teams for selection'
        });
        // Fallback to empty array
        this.teams = [];
      }
    });
  }

  private handleRouteParams(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.isEditMode = true;
        this.loadUser(this.userId);
      }

      // Set password validation based on mode
      this.setPasswordValidation();
    });
  }

  private setPasswordValidation(): void {
    const passwordControl = this.userForm.get('password');
    const confirmPasswordControl = this.userForm.get('confirmPassword');
    
    if (!this.isEditMode) {
      // For new users, password is required
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    } else {
      // For editing, password is optional
      passwordControl?.clearValidators();
      confirmPasswordControl?.clearValidators();
    }
    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    
    // Only validate if both fields have values
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    // Clear the mismatch error if passwords match
    if (password === confirm) {
      const confirmControl = group.get('confirmPassword');
      if (confirmControl?.hasError('mismatch')) {
        confirmControl.setErrors(null);
      }
    }
    
    return null;
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: user => {
        this.originalUser = { ...user };
        
        // ✅ FIXED: Properly handle team assignment
        const teamId = user.team?.id || null;
        
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          profileInfo: user.profileInfo,
          role: user.role,
          points: user.points,
          teamId: teamId // Set the teamId from the team object
        });
        
        console.log('Loaded user:', user);
        console.log('Set teamId to:', teamId);
        
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: error.message 
        });
      }
    });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;
    console.log('Form value before processing:', formValue);
    
    // ✅ FIXED: Build user object with proper team handling
    const userToSend: any = {
      name: formValue.name,
      email: formValue.email,
      profileInfo: formValue.profileInfo,
      role: formValue.role
    };

    // ✅ FIXED: Handle team assignment properly - use teamId from form
    if (formValue.teamId) {
      userToSend.team = { id: formValue.teamId }; // ✅ Send team object with id
      console.log('Setting team to:', userToSend.team);
    }

    // Handle password (only include if provided)
    if (formValue.password && formValue.password.trim()) {
      userToSend.password = formValue.password;
    }

    // Handle points (only for edit mode if changed)
    if (this.isEditMode && this.originalUser && formValue.points !== this.originalUser.points) {
      userToSend.points = formValue.points;
    }

    // For edit mode, include the ID
    if (this.isEditMode && this.userId) {
      userToSend.id = this.userId;
    }

    console.log('Final user data being sent to service:', userToSend);

    this.loading = true;
    const operation = this.isEditMode && this.userId
      ? this.userService.updateUser(this.userId, userToSend)
      : this.userService.createUser(userToSend);

    operation.subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Operation successful:', response);
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: `User ${this.isEditMode ? 'updated' : 'created'} successfully` 
        });
        setTimeout(() => this.router.navigate(['/users']), 1000);
      },
      error: error => {
        this.loading = false;
        console.error('Operation failed:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Operation Failed', 
          detail: error.message 
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}