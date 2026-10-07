import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipmentUnitsComponent } from './equipment-units.component';

describe('EquipmentUnitsComponent', () => {
  let component: EquipmentUnitsComponent;
  let fixture: ComponentFixture<EquipmentUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentUnitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentUnitsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
