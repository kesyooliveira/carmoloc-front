import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '../user.model';

@Component({
    imports: [ReactiveFormsModule],
    standalone: true,
    selector: 'app-user-form',
    styleUrl: './user-form.component.scss',
    templateUrl: './user-form.component.html',
})
export class UserFormComponent {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly isEditMode = signal(false);
    readonly isLoading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    private userId: string | null = null;

    readonly form = this.fb.nonNullable.group({
        username: ['', Validators.required],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
        role: ['EMPLOYEE' as UserRole, Validators.required]
    }, {validators: this.passwordMatchValidator});

    private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;

        return password === passwordConfirm ? null : {passwordMismatch: true};
    }

    constructor() {
        this.userId = this.route.snapshot.paramMap.get('id');

        if (this.userId) {
            this.isEditMode.set(true);
            this.form.controls.username.disable();
            this.form.controls.password.disable();
            this.form.controls.passwordConfirm.disable();
            this.loadUser(this.userId);
        }
    }

    private loadUser(userId: string): void {
        this.isLoading.set(true);
        this.userService.findById(userId).subscribe({
            next: user => {
                this.form.patchValue(user);
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

        const raw = this.form.getRawValue();

        const {  passwordConfirm, ...payload } = raw as any;

        const request$ = this.isEditMode()
            ? this.userService.update(this.userId!, payload as any)
            : this.userService.create(payload as any);

        request$.subscribe({
            next: () => {
                this.isLoading.set(false);
                this.router.navigate(['/users']);
            },
            error: (error) => {
                this.isLoading.set(false);
                this.errorMessage.set(error.error?.message ?? 'Erro ao salvar usuário.');
            }
        });
    }
}
