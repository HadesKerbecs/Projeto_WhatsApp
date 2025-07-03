import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_BASE_URL } from '../../services/api';
import { Cliente } from '../../interfaces/cliente.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-registrar-numero',
    imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './registrar-numero.html',
  styleUrls: ['./registrar-numero.scss']
})
export class RegistrarNumeroComponent {
  numero = '';
  empresaId = '';

  constructor(private http: HttpClient, private router: Router) {}

  registrarNumero(): void {
    const cliente: Cliente = {
      numero: this.numero,
      empresaId: this.empresaId,
    };

    this.http.post(`${BACKEND_BASE_URL}/clientes`, cliente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).subscribe({
      next: () => {
        alert('Número registrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Erro ao registrar número')
    });
  }

  cancelar(): void {
    this.router.navigate(['/login']);
  }
}
