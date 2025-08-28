import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamleadListComponent } from './teamlead-list.component';

describe('TeamleadListComponent', () => {
  let component: TeamleadListComponent;
  let fixture: ComponentFixture<TeamleadListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamleadListComponent]
    });
    fixture = TestBed.createComponent(TeamleadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
