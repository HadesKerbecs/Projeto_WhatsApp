import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACKEND_BASE_URL } from '../../services/api';
import { Cliente } from '../../interfaces/cliente.model';

@Component({
  selector: 'app-registrar-numero',
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
