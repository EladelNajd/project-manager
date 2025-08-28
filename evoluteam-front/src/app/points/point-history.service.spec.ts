import { TestBed } from '@angular/core/testing';

import { PointHistoryService } from './point-history.service';

describe('PointHistoryService', () => {
  let service: PointHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PointHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
