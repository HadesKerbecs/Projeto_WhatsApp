import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoForm } from './produto-form';

describe('ProdutoForm', () => {
  let component: ProdutoForm;
  let fixture: ComponentFixture<ProdutoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
