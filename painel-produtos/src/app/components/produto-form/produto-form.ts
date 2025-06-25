import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProdutoService } from '../../services/produto';


@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.scss'
})
export class ProdutoForm implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  produtoId!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      preco: ['', Validators.required], // string com máscara
      descricao: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.produtoId = id;
      this.produtoService.buscarPorId(id).subscribe({
        next: (produto) => {
          (this.form.get('preco') as any).setValue(this.formatarParaReal(produto.preco));
          this.form.patchValue(produto);
        },
        error: () => this.router.navigate(['/produtos'])
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const precoLimpo = +formValue.preco.replace(/\D+/g, '') / 100;

    const produto = {
      nome: formValue.nome,
      preco: precoLimpo,
      descricao: formValue.descricao
    };

    const operacao = this.isEditMode
      ? this.produtoService.atualizar(this.produtoId, produto)
      : this.produtoService.criar(produto);

    operacao.subscribe(() => this.router.navigate(['/produtos']));
  }

  private formatarParaReal(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  aplicarMascara(event: any): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = (parseInt(valor, 10) / 100).toFixed(2) + '';
    valor = valor.replace('.', ',');
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    event.target.value = 'R$ ' + valor;
    this.form.get('preco')?.setValue(event.target.value);
  }
}
