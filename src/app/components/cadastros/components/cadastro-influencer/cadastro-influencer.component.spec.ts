import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroInfluencerComponent } from './cadastro-influencer.component';

describe('CadastroInfluencerComponent', () => {
  let component: CadastroInfluencerComponent;
  let fixture: ComponentFixture<CadastroInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroInfluencerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
