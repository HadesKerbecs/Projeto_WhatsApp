import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class Login {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    const success = this.authService.login(this.username, this.password);

    if (success) {
      console.log('Login bem-sucedido, redirecionando...');

      this.router.navigate(['/produtos']);
    } else {
      alert('Usuário ou senha inválidos.')
    }
  }
}
