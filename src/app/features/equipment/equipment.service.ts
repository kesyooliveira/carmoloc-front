import { inject, Injectable } from "@angular/core";
import { ApiService } from "../../shared/services/api.service";
import { AddEquipmentUnitsRequestDTO, EquipmentResponseDTO, EquipmentUnitResponseDTO, EquipmentUnitStatus } from "./equipment.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class EquipmentService extends ApiService<EquipmentResponseDTO, EquipmentResponseDTO>{
    constructor() {
        const http = inject(HttpClient);
        super(http, '/api/equipment');
    }

    findUnits(equipmentId: string): Observable<EquipmentUnitResponseDTO[]> {
        return this.http.get<EquipmentUnitResponseDTO[]>(`${this.baseUrl}/${equipmentId}/units`);
    }

    addUnits(equipmentId: string, payload: AddEquipmentUnitsRequestDTO): Observable<EquipmentUnitResponseDTO[]> {
        return this.http.post<EquipmentUnitResponseDTO[]>(`${this.baseUrl}/${equipmentId}/units`, payload);
    }

    updateUnitStatus(unitId: string, status: EquipmentUnitStatus, maintenanceNote?: string): Observable<EquipmentUnitResponseDTO> {
        return this.http.patch<EquipmentUnitResponseDTO>(`${this.baseUrl}/units/${unitId}/status`, { status, maintenanceNote });
    }
}