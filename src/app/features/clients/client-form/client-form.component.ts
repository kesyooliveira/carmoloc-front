import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	imports: [ReactiveFormsModule],
	standalone: true,
	selector: 'app-client-form',
	styleUrl: './client-form.component.scss',
	templateUrl: './client-form.component.html',
})
export class ClientFormComponent {
	private readonly fb = inject(FormBuilder);
	private readonly clientService = inject(ClientService);
	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);

	readonly isEditMode = signal(false);
	readonly isLoading = signal(false);
	readonly errorMessage = signal<string | null>(null);

	private clientId: string | null = null;

	readonly form = this.fb.nonNullable.group({
		name: ['', Validators.required],
		documentType: ['CPF' as 'CPF' | 'CNPJ', Validators.required],
		document: ['', Validators.required],
		phone: ['', Validators.required],
		email: [''],
		description: [''],
		address: this.fb.group({
			street: [''],
			number: [''],
			neighborhood: [''],
			city: [''],
			state: [''],
			zipCode: ['']
		})
	});

	constructor() {
		this.clientId = this.route.snapshot.paramMap.get('id');

		if (this.clientId) {
			this.isEditMode.set(true);
			this.loadClient(this.clientId);
		}
	}

	private loadClient(id: string): void {
		this.isLoading.set(true);
		this.clientService.findById(id).subscribe({
			next: client => {
				this.form.patchValue(client);
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

		const payload = this.form.getRawValue();
		const request$ = this.isEditMode()
			? this.clientService.update(this.clientId!, payload)
			: this.clientService.create(payload);

		request$.subscribe({
			next: () => {
				this.isLoading.set(false);
				this.router.navigate(['/clients']);
			},
			error: (error) => {
				this.isLoading.set(false);
				this.errorMessage.set(error.error?.message ?? 'Erro ao salvar cliente.');
			}
		});
	}
}
