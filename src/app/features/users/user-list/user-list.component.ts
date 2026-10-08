import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserResponseDTO } from '../user.model';

@Component({
    imports: [RouterLink],
    standalone: true,
    selector: 'app-user-list',
    styleUrl: './user-list.component.scss',
    templateUrl: './user-list.component.html',
})
export class UserListComponent {
    private readonly userService = inject(UserService);
    protected readonly authService = inject(AuthService);

    readonly users = signal<UserResponseDTO[]>([]);
    readonly isLoading = signal(true);
    readonly errorMessage = signal<string | null>(null);

    constructor() {
        this.loadUsers();
    }

    private loadUsers(): void {
        this.isLoading.set(true);
        this.userService.findAll().subscribe({
            next: users => {
                this.users.set(users);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    delete(id: string): void {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) {
            return;
        }

        this.errorMessage.set(null);

        this.userService.delete(id).subscribe({
            next: () => this.loadUsers(),
            error: (error) => this.errorMessage.set(error.error?.message ?? 'Erro ao excluir usuário.')
        });
    }

    roleLabel(role: string): string {
        return role === 'ADMIN' ? 'Administrador' : 'Funcionário';
    }
}
