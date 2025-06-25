import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ProdutoLista } from './components/produto-lista/produto-lista';
import { authGuard } from './guards/auth-guard';
import { ProdutoForm } from './components/produto-form/produto-form';

export const routes: Routes = [
    {path: '', redirectTo: 'produtos', pathMatch: 'full'},
    {path: 'login', component: Login, title: 'Login'},
    {path: 'produtos', component: ProdutoLista, canActivate: [authGuard], title: 'Produtos'},
    {path: 'produtos/novo', component: ProdutoForm, canActivate: [authGuard], title: 'Novo Produto'},
    {path: 'produtos/editar/:id', component: ProdutoForm, canActivate: [authGuard], title: 'Editar Produto'},
];
