import { Injectable } from '@angular/core';
import { BACKEND_BASE_URL } from './api';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly BASE_URL = `${BACKEND_BASE_URL}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string }>(
        `${this.BASE_URL}/login`,
        { username, password },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        tap((res) => localStorage.setItem(this.TOKEN_KEY, res.token)),
        tap(() => console.log('Token salvo com sucesso')),
        map(() => true),
        catchError((err) => {
          console.error('Erro no login', err);
          return of(false);
        })
      );
  }

  registrar(user: User): Observable<User> {
    return this.http.post<User>(`${this.BASE_URL}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap(() => console.log('Usuário registrado com sucesso')),
      catchError((err) => {
        console.error('Erro no registro', err);
        throw err; // pode adaptar o erro para tratamento no componente
      })
    );
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem(this.TOKEN_KEY) !== null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.TOKEN_KEY) : null;
  }
}
