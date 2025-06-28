// webhook.component.ts (Angular standalone)
import { Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-webhook',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './webhook.html',
  styleUrls: ['./webhook.scss']

})
export class Webhook implements OnInit {
  mensagens: Mensagem[] = [];
  filtro: string = '';
  novaMensagem: string = '';
  clienteSelecionado: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    this.http.get<Mensagem[]>('/api/mensagens').subscribe((dados) => {
      this.mensagens = dados;
    });
  }

  get clientesUnicos(): string[] {
    const nomes = new Set(this.mensagens.map(m => m.cliente));
    return Array.from(nomes);
  }

  mensagensDoCliente(cliente: string) {
    return this.mensagens.filter(m => m.cliente === cliente);
  }

  selecionarCliente(cliente: string) {
    this.clienteSelecionado = cliente;
  }

  enviarMensagemManual() {
    if (!this.novaMensagem.trim()) return;

    this.http.post('/api/mensagens/enviar', {
      cliente: this.clienteSelecionado,
      mensagem: this.novaMensagem
    }).subscribe(() => {
      this.novaMensagem = '';
      this.carregarMensagens();
    });
  }
}
