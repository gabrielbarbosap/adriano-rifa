import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegradoraPixComponent } from './integradora-pix.component';

describe('IntegradoraPixComponent', () => {
  let component: IntegradoraPixComponent;
  let fixture: ComponentFixture<IntegradoraPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegradoraPixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegradoraPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
