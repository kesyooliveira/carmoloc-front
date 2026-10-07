import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipmentService } from '../equipment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipmentCategory, PricingType } from '../equipment.model';

@Component({
    imports: [ReactiveFormsModule],
    standalone: true,
    selector: 'app-equipment-form',
    styleUrl: './equipment-form.component.scss',
    templateUrl: './equipment-form.component.html',
})
export class EquipmentFormComponent {
    private readonly fb = inject(FormBuilder);
    private readonly equipmentService = inject(EquipmentService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly isEditMode = signal(false);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    private equipmentId: string | null = null;
    
    readonly categories: EquipmentCategory[] = ['BETONEIRA', 'COMPACTADOR', 'ESCORAMENTO', 'CONTAINER', 'ANDAIME'];

    readonly form = this.fb.nonNullable.group({
        name: ['', Validators.required],
        description: [''],
        category: ['BETONEIRA' as EquipmentCategory, Validators.required],
        pricingType: ['DAILY_ONLY' as PricingType, Validators.required],
        dailyPrice: [0, [Validators.required, Validators.min(0.01)]],
        halfDayPrice: [0],
        quantity: [1, [Validators.required, Validators.min(1)]]
    });

    constructor() {
        this.equipmentId = this.route.snapshot.paramMap.get('id');
        
        if (this.equipmentId) {
            this.isEditMode.set(true);
            this.form.controls.quantity.disable
            this.loadEquipment(this.equipmentId);
        }
    }

    get isDayAndHalf(): boolean {
        return this.form.get('pricingType')?.value === 'DAY_AND_HALF';
    }

    private loadEquipment(id: string): void {
        this.isLoading.set(true);
        this.equipmentService.findById(id).subscribe({
            next: equipment => {
                this.form.patchValue(equipment);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const raw = this.form.getRawValue();

        const payload = {
            ...raw,
            halfDayPrice: this.isDayAndHalf ? raw.halfDayPrice : null
        }

        const request$ = this.isEditMode()
            ? this.equipmentService.update(this.equipmentId!, payload as any)
            : this.equipmentService.create(payload as any);

        request$.subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/equipment']);
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.message ?? 'Erro ao salvar equipamento.');
            }
        })
    }
}
