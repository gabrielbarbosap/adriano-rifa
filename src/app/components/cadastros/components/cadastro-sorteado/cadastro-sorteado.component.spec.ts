import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroSorteadoComponent } from './cadastro-sorteado.component';

describe('CadastroSorteadoComponent', () => {
  let component: CadastroSorteadoComponent;
  let fixture: ComponentFixture<CadastroSorteadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroSorteadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroSorteadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
