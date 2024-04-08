import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsteticistasComponent } from './esteticistas.component';

describe('EsteticistasComponent', () => {
  let component: EsteticistasComponent;
  let fixture: ComponentFixture<EsteticistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsteticistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsteticistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
