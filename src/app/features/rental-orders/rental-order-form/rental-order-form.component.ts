import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RentalOrderService } from '../rental-order.service';
import { ClientService } from '../../clients/client.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { Router } from '@angular/router';
import { ClientResponseDTO } from '../../clients/client.model';
import { EquipmentResponseDTO } from '../../equipment/equipment.model';

@Component({
    imports: [ReactiveFormsModule],
    standalone: true,
    selector: 'app-rental-order-form',
    styleUrl: './rental-order-form.component.scss',
    templateUrl: './rental-order-form.component.html',
})
export class RentalOrderFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly rentalOrderService = inject(RentalOrderService);
    private readonly clientService = inject(ClientService);
    private readonly equipmentService = inject(EquipmentService);
    private readonly router = inject(Router);

    readonly clients = signal<ClientResponseDTO[]>([]);
    readonly equipmentList = signal<EquipmentResponseDTO[]>([]);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group({
        clientId: ['', Validators.required],
        items: this.fb.array([this.createItemGroup()])
    });

    get items(): FormArray {
        return this.form.get('items') as FormArray;
    }

    ngOnInit(): void {
        this.clientService.findAll().subscribe(clients => this.clients.set(clients));
        this.equipmentService.findAll().subscribe(equipment => this.equipmentList.set(equipment));
    }

    private createItemGroup(): FormGroup {
        return this.fb.nonNullable.group({
            equipmentId: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]],
            startDateTime: ['', Validators.required],
            endDateTime: ['', Validators.required]
        });
    }
    
    addItem(): void {
        this.items.push(this.createItemGroup());
    }

    removeItem(index: number): void {
        if (this.items.length > 1) {
            this.items.removeAt(index);
        }
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
            clientId: raw.clientId,
            items: raw.items.map(item => ({
                equipmentId: item['equipmentId'],
                quantity: item['quantity'],
                startDateTime: this.toIsoLocal(item['startDateTime']),
                endDateTime: this.toIsoLocal(item['endDateTime'])
            }))
        };

        this.rentalOrderService.create(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/rental-orders']);
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.message ?? 'Erro ao criar ordem.');
            }
        })
    }

    private toIsoLocal(datetimeLocalValue: string): string {
        return datetimeLocalValue.length === 16 ? `${datetimeLocalValue}:00` : datetimeLocalValue;
    }
}
