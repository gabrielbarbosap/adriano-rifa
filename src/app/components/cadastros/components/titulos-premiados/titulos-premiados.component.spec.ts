import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitulosPremiadosComponent } from './titulos-premiados.component';

describe('TitulosPremiadosComponent', () => {
  let component: TitulosPremiadosComponent;
  let fixture: ComponentFixture<TitulosPremiadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitulosPremiadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitulosPremiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
