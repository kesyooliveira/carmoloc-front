import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EquipmentService } from '../equipment.service';
import { EquipmentResponseDTO, EquipmentUnitResponseDTO, EquipmentUnitStatus } from '../equipment.model';

@Component({
    imports: [RouterLink, ReactiveFormsModule],
    standalone: true,
    selector: 'app-equipment-units',
    styleUrl: './equipment-units.component.scss',
    templateUrl: './equipment-units.component.html',
})
export class EquipmentUnitsComponent {
    private readonly fb = inject(FormBuilder);
    private readonly equipmentService = inject(EquipmentService);
    private readonly route = inject(ActivatedRoute);

    private readonly equipmentId = this.route.snapshot.paramMap.get('id');

    readonly equipment = signal<EquipmentResponseDTO | null>(null); 
    readonly units = signal<EquipmentUnitResponseDTO[]>([]);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    readonly isAddingUnits = signal(false);
    readonly addUnitsForm = this.fb.nonNullable.group({
        quantity: [1, [Validators.required, Validators.min(1)]]
    });

    readonly statusOptions: EquipmentUnitStatus[] = ['AVAILABLE', 'MAINTENANCE', 'RETIRED'];

    constructor() {
        this.loadEquipment();
        this.loadUnits();
    }

    private loadEquipment(): void {
        this.equipmentService.findById(this.equipmentId!).subscribe(equipment => {
        this.equipment.set(equipment);
        });
    }

    private loadUnits(): void {
        this.isLoading.set(true);
        this.equipmentService.findUnits(this.equipmentId!).subscribe({
            next: units => {
                this.units.set(units);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    toggleAddUnits(): void {
        this.isAddingUnits.update(open => !open);
    }

    submitAddUnits(): void {
        if (this.addUnitsForm.invalid) {
            this.addUnitsForm.markAllAsTouched();
            return;
        }

        this.errorMessage.set(null);
        const quantity = this.addUnitsForm.getRawValue().quantity;
        
        this.equipmentService.addUnits(this.equipmentId!, {quantity}).subscribe({
            next: () => {
                this.isAddingUnits.set(false);
                this.addUnitsForm.reset({quantity: 1});
                this.loadUnits();
                this.loadEquipment();
            },
            error: (error) => {
                this.errorMessage.set(error.error?.message ?? 'Erro ao adicionar unidades.');
            }
        });
    }

    changeStatus(unitId: string, status: EquipmentUnitStatus): void {
        this.equipmentService.updateUnitStatus(unitId, status).subscribe({
            next: () => {
                this.loadUnits();
                this.loadEquipment();
            },
            error: (error) => {
                this.errorMessage.set(error.error?.message ?? 'Erro ao atualizar status da unidade.');
            }
        });
    }

    statusLabel(status: string): string {
        const labels: Record<string, string> = {
            AVAILABLE: 'Disponível',
            MAINTENANCE: 'Manutenção',
            RETIRED: 'Aposentado'
        }
        return labels[status] ?? status;
    } 
}
