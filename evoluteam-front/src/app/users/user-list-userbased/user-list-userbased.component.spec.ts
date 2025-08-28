import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListUserbasedComponent } from './user-list-userbased.component';

describe('UserListUserbasedComponent', () => {
  let component: UserListUserbasedComponent;
  let fixture: ComponentFixture<UserListUserbasedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListUserbasedComponent]
    });
    fixture = TestBed.createComponent(UserListUserbasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
