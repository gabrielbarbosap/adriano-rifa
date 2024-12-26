import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorReqComponent } from './error-req.component';

describe('ErrorReqComponent', () => {
  let component: ErrorReqComponent;
  let fixture: ComponentFixture<ErrorReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
