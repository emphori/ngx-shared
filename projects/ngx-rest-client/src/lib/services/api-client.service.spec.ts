import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { ApiClientService } from './api-client.service';

describe('ApiClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: 'ApiClientConfig',
        useValue: { host: 'localhost' }
      },
      ApiClientService,
      HttpClient,
      HttpHandler
    ]
  }));

  it('should be created', () => {
    const service: ApiClientService = TestBed.get(ApiClientService);
    expect(service).toBeTruthy();
  });
});
