export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    refreshToken: string;
    username: string;
    role: 'ADMIN' | 'EMPLOYEE';
}

export interface RefreshTokenRequestDTO {
    refreshToken: string;
}