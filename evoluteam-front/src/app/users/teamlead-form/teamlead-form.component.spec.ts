import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleadFormComponent } from './teamlead-form.component';

describe('TeamleadFormComponent', () => {
  let component: TeamleadFormComponent;
  let fixture: ComponentFixture<TeamleadFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamleadFormComponent]
    });
    fixture = TestBed.createComponent(TeamleadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
