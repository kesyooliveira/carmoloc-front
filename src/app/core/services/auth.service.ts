import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LoginRequestDTO, LoginResponseDTO, RefreshTokenRequestDTO } from "../models/auth.model";
import { Observable, tap } from "rxjs";

const ACCESS_TOKEN_KEY = 'carmoloc_access_token';
const REFRESH_TOKEN_KEY = 'carmoloc_refresh_token';
const USERNAME_KEY = 'carmoloc_username';
const ROLE_KEY = 'carmoloc_role';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

    private readonly baseUrl = '/api/auth';

    readonly username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
    readonly role = signal<'ADMIN' | 'EMPLOYEE' | null>(
        localStorage.getItem(ROLE_KEY) as 'ADMIN' | 'EMPLOYEE' | null
    );

    readonly isAuthenticated = computed(() => !!this.username());
    readonly idAdmin = computed(() => this.role() === 'ADMIN');

    login(request: LoginRequestDTO): Observable<LoginResponseDTO> {
        return this.http.post<LoginResponseDTO>(`${this,this.baseUrl}/login`, request).pipe(
            tap(response => this.storeSession(response))
        );
    }

    refreshToken(): Observable<LoginResponseDTO> {
        const refreshToken = this.getRefreshToken();
        const request: RefreshTokenRequestDTO = { refreshToken: refreshToken ?? ''};

        return this.http.post<LoginResponseDTO>(`${this.baseUrl}/refresh`, request).pipe(
            tap(response => this.storeSession(response))
        );
    }

    logout(): void {
        this.http.post(`${this.baseUrl}/logout`, {}).subscribe({
            next: () => this.clearSessionAndRedirect(),
            error: () => this.clearSessionAndRedirect()
        });
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    storeSession(response: LoginResponseDTO): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
        localStorage.setItem(USERNAME_KEY, response.username);
        localStorage.setItem(ROLE_KEY, response.role);

        this.username.set(response.username);
        this.role.set(response.role);
    }

    clearSessionAndRedirect(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(ROLE_KEY);

        this.username.set(null);
        this.role.set(null);

        this.router.navigate(['/login']);
    }

    forceLogout(): void {
        this.clearSessionAndRedirect();
    }
}