export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface UserRequestDTO {
    username: string;
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface UserUpdateRequestDTO {
    fullName: string;
    email: string;
    role: UserRole;
}

export interface UserResponseDTO {
    id: string;
    username: string;
    fullName: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
}