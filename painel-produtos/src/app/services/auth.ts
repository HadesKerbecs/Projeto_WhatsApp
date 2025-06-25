import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';  
  }

  login(username: string, password: string): boolean {
    if (username.trim() && password.trim()) {
      if(this.isBrowser) {
        const fakeToken = btoa(`${username}:${password}`);
        localStorage.setItem(this.TOKEN_KEY, fakeToken);
      }
      // FUTURAMENTE: aqui você chamaria uma API real, como:
      // this.http.post('/api/login', { username, password }).subscribe(...)
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.isBrowser && localStorage.getItem(this.TOKEN_KEY) !== null;
  }
  
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
  }
}

  getToken():string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY): null;
  }
}
