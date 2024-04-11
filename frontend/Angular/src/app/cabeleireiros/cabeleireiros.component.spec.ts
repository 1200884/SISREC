import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeleireirosComponent } from './cabeleireiros.component';

describe('CabeleireirosComponent', () => {
  let component: CabeleireirosComponent;
  let fixture: ComponentFixture<CabeleireirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabeleireirosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CabeleireirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
