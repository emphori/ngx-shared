import { TestBed } from '@angular/core/testing';

import { NgxRestClientService } from './ngx-rest-client.service';

describe('NgxRestClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxRestClientService = TestBed.get(NgxRestClientService);
    expect(service).toBeTruthy();
  });
});
