import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegradoraSistemaComponent } from './integradora-sistema.component';

describe('IntegradoraSistemaComponent', () => {
  let component: IntegradoraSistemaComponent;
  let fixture: ComponentFixture<IntegradoraSistemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegradoraSistemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegradoraSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
