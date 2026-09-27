import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { ClientRequestDTO, ClientResponseDTO } from "./client.model";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ClientService extends ApiService<ClientResponseDTO, ClientRequestDTO>{
    constructor() {
        const http = inject(HttpClient);
        super(http, '/api/clients');
    }
}