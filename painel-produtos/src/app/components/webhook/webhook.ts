import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BACKEND_BASE_URL } from '../../services/api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-webhook',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  templateUrl: './webhook.html',
  styleUrls: ['./webhook.scss']
})
export class Webhook implements OnInit {
  mensagens: Mensagem[] = [];
  filtro: string = '';
  novaMensagem: string = '';
  clienteSelecionado: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    this.http.get<Mensagem[]>(`${BACKEND_BASE_URL}/mensagens`).subscribe((dados) => {
      this.mensagens = dados;
      this.cdr.detectChanges();
    });
  }

  get clientesUnicos(): string[] {
    const nomes = new Set(this.mensagens.map(m => m.cliente));
    return Array.from(nomes);
  }

  get mensagensFiltradas(): Mensagem[] {
    return this.mensagens.filter(m => m.cliente === this.clienteSelecionado);
  }

  selecionarCliente(cliente: string) {
    this.clienteSelecionado = cliente;
  }

  enviarMensagemManual() {
    if (!this.novaMensagem.trim() || !this.clienteSelecionado) return;

    this.http.post(`${BACKEND_BASE_URL}/mensagens/enviar`, {
      cliente: this.clienteSelecionado,
      mensagem: this.novaMensagem
    }).subscribe(() => {
      this.novaMensagem = '';
      this.carregarMensagens();
    });
  }
}
