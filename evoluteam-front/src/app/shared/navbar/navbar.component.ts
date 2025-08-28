import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  showDropdown = false;
  currentUser: User | null = null;
  private sub?: Subscription;

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sub = this.authService['currentUserSubject'].subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  scrollToAbout() {
    if (this.router.url === '/') {
      const el = document.getElementById('about-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById('about-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      });
    }
  }
}
