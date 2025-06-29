import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BACKEND_BASE_URL } from '../../services/api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-webhook',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, BrowserAnimationsModule],
  templateUrl: './webhook.html',
  styleUrls: ['./webhook.scss']
})
export class Webhook implements OnInit {
  mensagens: Mensagem[] = [];
  filtro: string = '';
  novaMensagem: string = '';
  clienteSelecionado: string | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    if (!this.clienteSelecionado) return;

    this.http.get<Mensagem[]>(`${BACKEND_BASE_URL}/mensagens`).subscribe((dados) => {
      this.mensagens = dados.filter(m => m.cliente === this.clienteSelecionado);
      this.cdr.detectChanges();
    });
  }

  get clientesUnicos(): string[] {
    const nomes = new Set(this.mensagens.map(m => m.cliente));
    return Array.from(nomes);
  }

  get mensagensFiltradas(): Mensagem[] {
    if (!this.clienteSelecionado) return [];
    return this.mensagens.filter(m => m.cliente === this.clienteSelecionado);
  }

  selecionarCliente(cliente: string) {
    this.clienteSelecionado = cliente;
    this.carregarMensagens();
  }

  enviarMensagemManual() {
    if (!this.novaMensagem.trim() || !this.clienteSelecionado) return;

    const nova: Mensagem = {
      cliente: this.clienteSelecionado,
      mensagem: this.novaMensagem,
      bot: false,
      data: new Date().toISOString(),
      status: 'enviando'
    };

    this.novaMensagem = '';

    // Não adiciona localmente para evitar duplicação
    this.http.post(`${BACKEND_BASE_URL}/mensagens/enviar`, nova).subscribe(() => {
      this.carregarMensagens();  // Atualiza mensagens do backend (substitui a lista)
    });
  }

}
