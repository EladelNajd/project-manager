import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRequestFormComponent } from './skill-request-form.component';

describe('SkillRequestFormComponent', () => {
  let component: SkillRequestFormComponent;
  let fixture: ComponentFixture<SkillRequestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillRequestFormComponent]
    });
    fixture = TestBed.createComponent(SkillRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
