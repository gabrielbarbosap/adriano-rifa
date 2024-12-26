import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclaracaoResidenciaComponent } from './declaracao-residencia.component';

describe('DeclaracaoResidenciaComponent', () => {
  let component: DeclaracaoResidenciaComponent;
  let fixture: ComponentFixture<DeclaracaoResidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclaracaoResidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclaracaoResidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
