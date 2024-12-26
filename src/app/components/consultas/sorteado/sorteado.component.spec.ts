import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteadoComponent } from './sorteado.component';

describe('SorteadoComponent', () => {
  let component: SorteadoComponent;
  let fixture: ComponentFixture<SorteadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SorteadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorteadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
