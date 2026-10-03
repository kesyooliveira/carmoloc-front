import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { EquipmentResponseDTO } from "./equipment.model";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: "root"})
export class EquipmentService extends ApiService<EquipmentResponseDTO, EquipmentResponseDTO>{
    constructor() {
        const http = inject(HttpClient);
        super(http, '/api/equipment');
    }
}