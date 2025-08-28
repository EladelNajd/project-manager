import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRequestListComponent } from './skill-request-list.component';

describe('SkillRequestListComponent', () => {
  let component: SkillRequestListComponent;
  let fixture: ComponentFixture<SkillRequestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillRequestListComponent]
    });
    fixture = TestBed.createComponent(SkillRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
