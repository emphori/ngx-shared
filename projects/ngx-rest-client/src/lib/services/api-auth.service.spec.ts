import { TestBed } from '@angular/core/testing';

import { ApiAuthService } from './api-auth.service';

describe('ApiAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiAuthService,
    ],
  }));

  it('should be created', () => {
    const service: ApiAuthService = TestBed.get(ApiAuthService);
    expect(service).toBeTruthy();
  });
});
