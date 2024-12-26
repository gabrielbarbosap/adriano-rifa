import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdropClickDialogComponent } from './backdrop-click-dialog.component';

describe('BackdropClickDialogComponent', () => {
  let component: BackdropClickDialogComponent;
  let fixture: ComponentFixture<BackdropClickDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackdropClickDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackdropClickDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
