import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarNumero } from './registrar-numero';

describe('RegistrarNumero', () => {
  let component: RegistrarNumero;
  let fixture: ComponentFixture<RegistrarNumero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarNumero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarNumero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
