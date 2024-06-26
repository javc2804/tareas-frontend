import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { catchError, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';

interface Credentials {
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    this.setAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  }

  login(credentials: Credentials) {
    return this.http
      .get(`${environment.apiUrl}/users/${credentials.email}`)
      .pipe(
        tap((response: any) => {
          if (response.ok) {
            this.setAuthenticated(true);
            this.router.navigate(['home']);
          }
        }),
        catchError((error) => {
          this.setAuthenticated(false);
          return throwError('Something bad happened; please try again later.');
        })
      );
  }

  register(credentials: Credentials) {
    return this.http.post(`${environment.apiUrl}/users/`, credentials).pipe(
      catchError((error) => {
        return throwError('Something bad happened; please try again later.');
      })
    );
  }

  logout() {
    this.setAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  setAuthenticated(isAuthenticated: boolean): void {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }
}
