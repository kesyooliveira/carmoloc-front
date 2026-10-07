import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { EquipmentService } from '../equipment.service';
import { AuthService } from '../../../core/services/auth.service';
import { EquipmentResponseDTO } from '../equipment.model';
import { CurrencyPipe } from '@angular/common';

@Component({
    imports: [RouterLink, PaginationComponent, CurrencyPipe],
    standalone: true,
    selector: 'app-equipment-list',
    styleUrl: './equipment-list.component.scss',
    templateUrl: './equipment-list.component.html',
})
export class EquipmentListComponent {
    private readonly equipmentService = inject(EquipmentService);
    protected readonly authService = inject(AuthService);

    readonly equipmentList = signal<EquipmentResponseDTO[]>([]);
    readonly isLoading = signal(false);

    readonly pageNumber = signal(0);
    readonly pageSize = signal(15);
    readonly totalElements = signal(0);
    readonly totalPages = signal(0);

    constructor() {
        this.loadEquipment();
    }

    private loadEquipment(): void {
        this.isLoading.set(true);
        this.equipmentService.findAllPaged(this.pageNumber(), this.pageSize(), 'name,asc').subscribe({
            next: page => {
                this.equipmentList.set(page.content);
                this.totalElements.set(page.totalElements);
                this.totalPages.set(page.totalPages);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    onPageChange(page: number): void {
        this.pageNumber.set(page);
        this.loadEquipment();
    }

    delete(id: string): void {
        if (!confirm('Deseja realmente excluir este equipamento?')) {
            return;
        }

        this.equipmentService.delete(id).subscribe({
            next: () => this.loadEquipment(),
            error: (error) => alert(error.error?.message ?? 'Erro ao excluir equipamento.')
        });
    }

    categoryLabel(category: string): string {
        const labels: Record<string, string> = {
            BETONEIRA: 'Betoneira',
            COMPACTADOR: 'Compactador',
            ESCORAMENTO: 'Escoramento',
            CONTAINER: 'Container',
            ANDAIME: 'Andaime'
        }
        return labels[category] ?? category;
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
