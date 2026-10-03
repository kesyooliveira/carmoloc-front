import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalOrderListComponent } from './rental-order-list.component';

describe('RentalOrderListComponent', () => {
  let component: RentalOrderListComponent;
  let fixture: ComponentFixture<RentalOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalOrderListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalOrderListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
