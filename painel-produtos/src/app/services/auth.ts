import { Injectable } from '@angular/core';
import { BACKEND_BASE_URL } from './api';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/usuario.model';
import * as jwtDecode  from 'jwt-decode';

interface JWTPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly BASE_URL = `${BACKEND_BASE_URL}`;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string }>(
        `${this.BASE_URL}/auth/login`,
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
    return this.http.post<User>(`${this.BASE_URL}/auth/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap(() => console.log('Usuário registrado com sucesso')),
      catchError((err) => {
        console.error('Erro no registro', err);
        throw err;
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      // forçar o tipo da função, passando por unknown
      const decodeFn = jwtDecode as unknown as (token: string) => JWTPayload;
      const decoded = decodeFn(token);

      if (!decoded.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
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
