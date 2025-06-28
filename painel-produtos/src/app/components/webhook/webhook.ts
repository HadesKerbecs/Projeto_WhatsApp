import { Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-webhook',
  imports: [],
  templateUrl: './webhook.html',
  styleUrl: './webhook.scss'
})
export class Webhook implements OnInit{
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
    })
  }

  get mensagensFiltradas() {
    const termo = this.filtro.toLowerCase().trim();
    return this.mensagens.filter(m => m.cliente.toLowerCase().includes(termo));
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
