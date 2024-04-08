import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolariosComponent } from './solarios.component';

describe('SolariosComponent', () => {
  let component: SolariosComponent;
  let fixture: ComponentFixture<SolariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
