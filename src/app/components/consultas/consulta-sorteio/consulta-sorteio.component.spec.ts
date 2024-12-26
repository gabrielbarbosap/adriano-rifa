import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaSorteioComponent } from './consulta-sorteio.component';

describe('ConsultaSorteioComponent', () => {
  let component: ConsultaSorteioComponent;
  let fixture: ComponentFixture<ConsultaSorteioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaSorteioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaSorteioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
