import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdiantamentosComponent } from './adiantamentos.component';

describe('AdiantamentosComponent', () => {
  let component: AdiantamentosComponent;
  let fixture: ComponentFixture<AdiantamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdiantamentosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdiantamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
