import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './api';
import { Produto } from '../interfaces/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  listar(): Observable<Produto[]> {
    return from(getProducts());
  }

  buscarPorId(id: string): Observable<Produto> {
    return from(getProductById(id));
  }

  criar(produto: Omit<Produto, 'id'>): Observable<Produto> {
    return from(createProduct(produto));
  }

  atualizar(id: string, produto: Omit<Produto, 'id'>): Observable<Produto> {
    return from(updateProduct(id, produto));
  }

  remover(id: string): Observable<void> {
    return from(deleteProduct(id));
  }
}