import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BACKEND_BASE_URL } from '../../services/api';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged } from 'rxjs/operators';

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
  private mensagensCarregadas: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    if (this.mensagensCarregadas) return;
    
    this.http.get<Mensagem[]>(`${BACKEND_BASE_URL}/mensagens`)
      .pipe(distinctUntilChanged())
      .subscribe((dados) => {
        this.mensagens = dados;
        this.mensagensCarregadas = true;
        this.cdr.detectChanges();
      });
  }

  get clientesUnicos(): string[] {
    const nomes = new Set(this.mensagens.map(m => m.cliente));
    return Array.from(nomes);
  }

  get mensagensFiltradas(): Mensagem[] {
    if (!this.clienteSelecionado) return [];
    return this.mensagens
      .filter(m => m.cliente === this.clienteSelecionado)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  selecionarCliente(cliente: string) {
    if (this.clienteSelecionado !== cliente) {
      this.clienteSelecionado = cliente;
      this.cdr.detectChanges();
    }
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

    this.http.post(`${BACKEND_BASE_URL}/mensagens/enviar`, nova).subscribe(() => {
      this.mensagensCarregadas = false;
      this.carregarMensagens();
    });
  }

  voltar() {
    this.router.navigate(['/produtos']);
  }
}