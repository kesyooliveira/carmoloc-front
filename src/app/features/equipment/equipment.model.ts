export type PricingType = 'DAILY_ONLY' | 'DAY_AND_HALF';
export type EquipmentCategory = 'BETONEIRA' | 'COMPACTADOR' | 'ESCORAMENTO' | 'CONTAINER' | 'ANDAIME';
export type EquipmentStatus = 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED';
export type EquipmentUnitStatus = 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED';

export interface EquipmentRequestDTO {
    name: string;
    description?: string | null;
    category: EquipmentCategory;
    pricingType: PricingType;
    dailyPrice: number;
    halfDayPrice?: number | null;
    quantity: number;
    assetCodes?: string[] | null;
}

export interface EquipmentUpdateRequestDTO {
    name: string;
    description?: string | null;
    category: EquipmentCategory;
    pricingType: PricingType;
    dailyPrice: number;
    halfDayPrice?: number | null;
}

export interface EquipmentResponseDTO {
    id: string;
    name: string;
    description: string;
    category: EquipmentCategory;
    pricingType: PricingType;
    dailyPrice: number;
    halfDayPrice?: number;
    status: string;
    totalUnits: number;
    availableUnits: number;
    active: boolean;
}

export interface EquipmentUnitResponseDTO {
    id: string;
    assetCode?: string | null;
    status: EquipmentUnitStatus;
    equipmentId: string;
    maintenanceNote?: string | null;
    createdAt: string;
}

export interface AddEquipmentUnitsRequestDTO {
    quantity: number;
    assetCodes?: string[] | null;
}