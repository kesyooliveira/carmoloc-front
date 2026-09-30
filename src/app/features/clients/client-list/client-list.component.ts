import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../client.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClientResponseDTO } from '../client.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
	imports: [RouterLink, PaginationComponent],
	selector: 'app-client-list',
	standalone: true,
	styleUrl: './client-list.component.scss',
	templateUrl: './client-list.component.html',
})
export class ClientListComponent {
	private readonly clientService = inject(ClientService);
	protected readonly authService = inject(AuthService);

	readonly clients = signal<ClientResponseDTO[]>([]);
	readonly isLoading = signal(false);

	readonly pageNumber = signal(0);
	readonly pageSize = signal(15);
	readonly totalElements = signal(0);
	readonly totalPages = signal(0);

	constructor() {
		this.loadClients();
	}

	private loadClients(): void {
		this.isLoading.set(true);
		this.clientService.findAllPaged(this.pageNumber(), this.pageSize(), 'createdAt,asc').subscribe({
			next: page => {
				this.clients.set(page.content);
				this.totalElements.set(page.totalElements);
				this.totalPages.set(page.totalPages);
				this.isLoading.set(false);
			},
			error: () => this.isLoading.set(false)
		})
	}

	onPageChange(page: number): void {
		this.pageNumber.set(page);
		this.loadClients();
	}

	delete(id: string): void {
		if (!confirm('Deseja realmente excluir este cliente?')) {
			return;
		}

		this.clientService.delete(id).subscribe(() => {
			this.clients.update(list => list.filter(c => c.id !== id));
		})
	}
}
