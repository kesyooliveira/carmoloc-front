import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    standalone: true,
    selector: 'app-private-layout',
    styleUrl: './private-layout.component.scss',
    templateUrl: './private-layout.component.html',
})
export class PrivateLayoutComponent {
    protected readonly authService = inject(AuthService);

    readonly isSidebarOpen = signal(false);

    toggleSideBar(): void {
        this.isSidebarOpen.update(open => !open);
    }

    logout(): void {
        this.authService.logout();
    }
}
