import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ProdutoLista } from './components/produto-lista/produto-lista';
import { authGuard } from './guards/auth-guard';
import { ProdutoForm } from './components/produto-form/produto-form';
import { RegistrarComponent } from './components/registrar/registrar';
import { Webhook } from './components/webhook/webhook';
import { RegistrarNumeroComponent } from './components/registrar-numero/registrar-numero';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'produtos', component: ProdutoLista, canActivate: [authGuard], title: 'Produtos' },
  { path: 'produtos/novo', component: ProdutoForm, canActivate: [authGuard], title: 'Novo Produto' },
  { path: 'produtos/editar/:id', component: ProdutoForm, canActivate: [authGuard], title: 'Editar Produto' },
  { path: 'registrar', component: RegistrarComponent, title: 'Criar Conta' },
  { path: 'registrar-numero', component: RegistrarNumeroComponent, title: 'Registrar Número' },
  { path: 'whatsapp', component: Webhook, canActivate: [authGuard], title: 'WhatsApp' }
];
