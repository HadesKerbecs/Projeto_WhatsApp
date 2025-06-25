import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoLista } from './produto-lista';

describe('ProdutoLista', () => {
  let component: ProdutoLista;
  let fixture: ComponentFixture<ProdutoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoLista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
