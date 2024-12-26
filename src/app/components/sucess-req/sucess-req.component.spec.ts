import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessReqComponent } from './sucess-req.component';

describe('SucessReqComponent', () => {
  let component: SucessReqComponent;
  let fixture: ComponentFixture<SucessReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucessReqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucessReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
