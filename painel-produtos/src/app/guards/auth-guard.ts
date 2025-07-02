import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const isValid = token && !authService.isTokenExpired(token);

  if (isValid) {
    return true;
  } else {
    console.warn('🔒 Token ausente ou expirado. Redirecionando para login...');
    authService.logout();
    router.navigate(['/login']);
    return false;
  }
};
