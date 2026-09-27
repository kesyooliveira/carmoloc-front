import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/private-layout/private-layout.component').then(m => m.PrivateLayoutComponent),
        children: [
            { path: '', 
                redirectTo: 'clients', 
                pathMatch: 'full' 
            },
            {
                path: 'clients',
                loadComponent: () => import('./features/clients/client-list/client-list.component').then(m => m.ClientListComponent)
            },
            {
                path: 'clients/new',
                loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
            },
            {
                path: 'clients/:id/edit',
                loadComponent: () => import('./features/clients/client-form/client-form.component').then(m => m.ClientFormComponent)
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
