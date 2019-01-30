import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiAuthService } from '../services/api-auth.service';

@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  constructor(
    private apiAuth: ApiAuthService,
    private router: Router
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.apiAuth.getToken()}`,
        },
      }))
      .pipe(catchError((response: any) => {
        if (response instanceof HttpErrorResponse && response.status === 401) {
          this.router.navigate(['/login']);
        }
        return Observable.throw(response);
      }));
  }
}
