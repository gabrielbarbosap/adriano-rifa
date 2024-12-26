import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegradoraComponent } from './integradora.component';

describe('IntegradoraComponent', () => {
  let component: IntegradoraComponent;
  let fixture: ComponentFixture<IntegradoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegradoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
