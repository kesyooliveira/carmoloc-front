import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { RentalOrderRequestDTO, RentalOrderResponseDTO } from "./rental-order.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class RentalOrderService extends ApiService<RentalOrderResponseDTO, RentalOrderRequestDTO> {
    constructor() {
        const http = inject(HttpClient);
        super(http, '/api/rental-orders');
    }

    confirm(id: string): Observable<RentalOrderResponseDTO> {
        return this.http.patch<RentalOrderResponseDTO>(`${this.baseUrl}/${id}/confirm`, {});
    }

    finish(id: string): Observable<RentalOrderResponseDTO> {
        return this.http.patch<RentalOrderResponseDTO>(`${this.baseUrl}/${id}/finish`, {});
    }

    cancel(id: string): Observable<RentalOrderResponseDTO> {
        return this.http.patch<RentalOrderResponseDTO>(`${this.baseUrl}/${id}/cancel`, {});
    }
}