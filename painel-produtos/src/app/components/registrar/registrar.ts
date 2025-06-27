import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  imports: [],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class Registrar {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar():void {
    const user = { username: this.username, password: this.password};
    this.authService.registrar(user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Erro ao registrar usuário!')
    });
  }
}
