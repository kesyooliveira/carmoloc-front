import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { UserRequestDTO, UserResponseDTO } from "./user.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class UserService extends ApiService<UserResponseDTO, UserRequestDTO>{
    
    constructor() {
        const http = inject(HttpClient);
        super(http, '/api/users');
    }
}