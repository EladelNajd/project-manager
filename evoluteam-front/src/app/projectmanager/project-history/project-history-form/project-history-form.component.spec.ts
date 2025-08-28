import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistoryFormComponent } from './project-history-form.component';

describe('ProjectHistoryFormComponent', () => {
  let component: ProjectHistoryFormComponent;
  let fixture: ComponentFixture<ProjectHistoryFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectHistoryFormComponent]
    });
    fixture = TestBed.createComponent(ProjectHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
