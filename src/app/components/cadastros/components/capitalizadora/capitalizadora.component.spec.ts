import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalizadoraComponent } from './capitalizadora.component';

describe('CapitalizadoraComponent', () => {
  let component: CapitalizadoraComponent;
  let fixture: ComponentFixture<CapitalizadoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalizadoraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapitalizadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
