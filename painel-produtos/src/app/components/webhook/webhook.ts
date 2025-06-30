import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Mensagem } from '../../interfaces/mensagem.models';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BACKEND_BASE_URL } from '../../services/api';
import { MatIconModule } from '@angular/material/icon';
import { distinctUntilChanged } from 'rxjs/operators';

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
  private carregandoMensagens: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    if (this.carregandoMensagens) return;

    this.carregandoMensagens = true;
    this.http.get<Mensagem[]>(`${BACKEND_BASE_URL}/mensagens`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      }
    })
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (dados) => {
          this.mensagens = this.removerDuplicatas(dados);
          this.carregandoMensagens = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.carregandoMensagens = false;
        }
      });
  }

  private removerDuplicatas(mensagens: Mensagem[]): Mensagem[] {
    const unicas = new Map<string, Mensagem>();
    mensagens.forEach(msg => {
      const chave = `${msg.cliente}-${msg.mensagem}-${msg.data}`;
      unicas.set(chave, msg);
    });
    return Array.from(unicas.values());
  }

  trackByMensagem(index: number, mensagem: Mensagem): string {
    return `${mensagem.cliente}-${mensagem.mensagem}-${mensagem.data}`;
  }

  get clientesUnicos(): string[] {
    const nomes = new Set(this.mensagens.map(m => m.cliente));
    const clientes = Array.from(nomes);

    if (this.filtro.trim()) {
      const termo = this.filtro.toLowerCase();
      return clientes.filter(cliente =>
        cliente.toLowerCase().includes(termo)
      );
    }

    return clientes;
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

  atualizarFiltro() {
    this.cdr.detectChanges();
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

    this.http.post(`${BACKEND_BASE_URL}/mensagens/enviar`, nova, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      }
    }).subscribe({
      next: () => {
        this.carregarMensagens();
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
      }
    });
  }

  voltar() {
    console.log('🔙 Botão de voltar clicado');
    this.router.navigate(['/produtos']);
  }
}