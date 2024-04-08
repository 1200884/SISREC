import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentExampleComponent } from './appointment-example.component';

describe('AppointmentExampleComponent', () => {
  let component: AppointmentExampleComponent;
  let fixture: ComponentFixture<AppointmentExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
