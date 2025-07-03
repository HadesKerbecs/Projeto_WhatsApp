import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTooltipModule,
  ],
  templateUrl: './registrar.html',
  styleUrls: ['./registrar.scss'],
})
export class RegistrarComponent {
  username = '';
  password = '';
  empresaId = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar(): void {
    const senhaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

    if (!senhaValida.test(this.password)) {
      alert('Senha deve ter ao menos 8 caracteres com maiúscula, minúscula, número e caractere especial.');
      return;
    }

    const user = {
      username: this.username,
      password: this.password,
      empresaId: this.empresaId,
    };

    this.authService.registrar(user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => alert('Erro ao registrar usuário!'),
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
}
