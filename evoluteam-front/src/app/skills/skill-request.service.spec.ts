import { TestBed } from '@angular/core/testing';

import { SkillRequestService } from './skill-request.service';

describe('SkillRequestService', () => {
  let service: SkillRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
