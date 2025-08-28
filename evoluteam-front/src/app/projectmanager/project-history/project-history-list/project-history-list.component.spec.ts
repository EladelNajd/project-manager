import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectHistoryListComponent } from './project-history-list.component';

describe('ProjectHistoryListComponent', () => {
  let component: ProjectHistoryListComponent;
  let fixture: ComponentFixture<ProjectHistoryListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectHistoryListComponent]
    });
    fixture = TestBed.createComponent(ProjectHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
