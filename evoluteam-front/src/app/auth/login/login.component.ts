import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error = 'Please fill in all required fields correctly.';
      return;
    }

    this.error = '';
    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        const role = this.authService.getRoleFromToken();

        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: `Welcome back, ${role}!`
        });

        // ✅ Redirect to homepage instead of dashboard
        this.router.navigate(['/']);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Login failed. Check your credentials.';
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid email or password.'
        });
        this.loading = false;
      }
    });
  }
}
