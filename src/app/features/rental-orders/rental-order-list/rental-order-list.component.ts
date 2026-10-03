import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RentalOrderService } from '../rental-order.service';
import { RentalOrderResponseDTO } from '../rental-order.model';
import { CurrencyPipe } from '@angular/common';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
    imports: [RouterLink, CurrencyPipe, PaginationComponent],
    standalone: true,
    selector: 'app-rental-order-list',
    styleUrl: './rental-order-list.component.scss',
    templateUrl: './rental-order-list.component.html',
})
export class RentalOrderListComponent {
    private readonly rentalOrderService = inject(RentalOrderService);

    readonly orders = signal<RentalOrderResponseDTO[]>([]);
    readonly isLoading = signal(true);
    readonly actionError = signal<string | null>(null);

    readonly pageNumber = signal(0);
    readonly pageSize = signal(15);
    readonly totalElements = signal(0);
    readonly totalPages = signal(0);

    constructor() {
        this.loadOrders();
    }

    private loadOrders(): void {
        this.isLoading.set(true);
        this.rentalOrderService.findAllPaged(this.pageNumber(), this.pageSize(), 'createdAt,desc').subscribe({
            next: page => {
                this.orders.set(page.content);
                this.totalElements.set(page.totalElements);
                this.totalPages.set(page.totalPages);
                this.isLoading.set(false);
            },
            error: () => {this.isLoading.set(false)}
        })
    }

    confirm(id: string): void {
        this.runAction(this.rentalOrderService.confirm(id));
    }

    finish(id: string): void {
        this.runAction(this.rentalOrderService.finish(id));
    }

    cancel(id: string): void {
        if (!confirm('Deseja realmente cancelar esta ordem?')) {
            return;
        }
        this.runAction(this.rentalOrderService.cancel(id));
    }

    private runAction(action$: ReturnType<RentalOrderService['confirm']>): void {
        this.actionError.set(null);
        action$.subscribe({
            next: () => this.loadOrders(),
            error: (error) => this.actionError.set(error.error?.message ?? 'Erro ao processar ação.')
        });
    }

    statusLabel(status: string): string {
        const labels: Record<string, string> = {
            QUOTE: 'Cotação',
            ACTIVE: 'Ativa',
            FINISHED: 'Finalizada',
            CANCELED: 'Cancelada'
        };

        return labels[status] ?? status;
    }

    onPageChange(page: number): void {
		this.pageNumber.set(page);
		this.loadOrders();
	}
}
