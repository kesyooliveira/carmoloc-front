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
            {
                path: 'rental-orders',
                loadComponent: () => import('./features/rental-orders/rental-order-list/rental-order-list.component').then(m => m.RentalOrderListComponent)
            },
            {
                path: 'rental-orders/new',
                loadComponent: () => import('./features/rental-orders/rental-order-form/rental-order-form.component').then(m => m.RentalOrderFormComponent)
            },
            {
                path: 'equipment',
                loadComponent: () => import('./features/equipment/equipment-list/equipment-list.component').then(m => m.EquipmentListComponent)
            },
            {
                path: 'equipment/new',
                loadComponent: () => import('./features/equipment/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
            },
            {
                path: 'equipment/:id/edit',
                loadComponent: () => import('./features/equipment/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
            },
            {
                path: 'equipment/:id/units',
                loadComponent: () => import('./features/equipment/equipment-units/equipment-units.component').then(m => m.EquipmentUnitsComponent)
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
