import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalOrderFormComponent } from './rental-order-form.component';

describe('RentalOrderFormComponent', () => {
  let component: RentalOrderFormComponent;
  let fixture: ComponentFixture<RentalOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalOrderFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalOrderFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
