import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  imports: [CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,],
  templateUrl: './registrar.html',
  styleUrl: './registrar.scss'
})
export class Registrar {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  registrar(): void {
    const user = { username: this.username, password: this.password };
    this.authService.registrar(user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Erro ao registrar usuário!')
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }

}
