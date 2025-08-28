import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from './auth.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRoleFromToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user role is included', () => {
    mockAuthService.getRoleFromToken.and.returnValue('ADMIN');
    const route = { data: { roles: ['ADMIN', 'USER'] } } as any;
    const state = {} as any;

    expect(guard.canActivate(route, state)).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and navigate if user role not included', () => {
    mockAuthService.getRoleFromToken.and.returnValue('GUEST');
    const route = { data: { roles: ['ADMIN', 'USER'] } } as any;
    const state = {} as any;

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });
});
