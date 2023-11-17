import { TestBed } from '@angular/core/testing';

import { GeoreferenceService } from './georeference.service';

describe('GeoreferenceService', () => {
  let service: GeoreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
