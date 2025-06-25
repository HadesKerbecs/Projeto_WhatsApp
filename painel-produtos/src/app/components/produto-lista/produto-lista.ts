import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProdutoService } from '../../services/produto';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Produto } from '../../interfaces/produto.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-produto-lista',
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    RouterModule],
  templateUrl: './produto-lista.html',
  styleUrl: './produto-lista.scss'
})
export class ProdutoLista implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  idParaExcluir: string | null = null;
  filtro: string = '';

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('ProdutoLista carregado')
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.aplicarFiltro();
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos', erro);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 })
      }
    });
  }

  aplicarFiltro(): void {
    const filtroMinusculo = this.filtro.toLowerCase().trim();
    this.produtosFiltrados = this.produtos.filter(p =>
      p.nome.toLowerCase().includes(filtroMinusculo) ||
      p.descricao?.toLowerCase().includes(filtroMinusculo)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  novoProduto(): void {
    this.router.navigate(['/produtos/novo']);
  }

  editarProduto(id: string): void {
    this.router.navigate(['/produtos/editar', id]);
  }

  abrirConfirmacao(id: string): void {
    this.idParaExcluir = id;
    this.dialog.open(this.confirmDialog, {
      data: { id }
    })
  }

  apagarProduto(id: string): void {
    this.produtoService.remover(id).subscribe({
      next: () => {
        this.snackBar.open('Produto removido com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarProdutos();
      },
      error: () => {
        this.snackBar.open('Erro ao remover produto', 'Fechar', { duration: 3000 });
      }
    });
  }
}
