import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClientService } from '../client.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClientResponseDTO } from '../client.model';

@Component({
	imports: [RouterLink],
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

	constructor() {
		this.loadClients();
	}

	private loadClients(): void {
		this.isLoading.set(true);
		this.clientService.findAll().subscribe({
			next: clients => {
				this.clients.set(clients);
				this.isLoading.set(false);
			},
			error: () => this.isLoading.set(false)
		});
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
