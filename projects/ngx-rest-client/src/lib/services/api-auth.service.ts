import { Injectable } from '@angular/core';

@Injectable()
export class ApiAuthService {
  public getToken(): string {
    return localStorage.getItem('token');
  }

  public setToken(token: string): void {
    return localStorage.setItem('token', token);
  }

  public removeToken(): void {
    return localStorage.removeItem('token');
  }
}
