export type PricingType = 'DAILY_ONLY' | 'DAY_AND_HALF';

export interface EquipmentResponseDTO {
    id: string;
    name: string;
    description: string;
    category: string;
    pricingType: PricingType;
    dailyPrice: number;
    halfDayPrice?: number;
    status: string;
    totalUnits: number;
    availableUnits: number;
    active: boolean;
}