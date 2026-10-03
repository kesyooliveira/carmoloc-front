export type RentaslOrderStatus = 'QUOTE' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';

export interface RentalOrderItemRequestDTO {
    equipmentId: string;
    quantity: number;
    startDateTime: string; // ISO ex 2022-01-01T00:00:00.000Z
    endDateTime: string;
}

export interface RentalOrderRequestDTO {
    clientId: string;
    items: RentalOrderItemRequestDTO[];
}

export interface RentalOrderItemResponseDTO {
    id: string;
    equipmentId: string;
    equipmentName: string;
    quantity: number;
    startDateTime: string;
    endDateTime: string;
    wholeDays: number;
    halfDayIncrement: boolean;
    dailyPriceSnapshot: number;
    halfDayPriceSnapshot?: number | null;
    subtotal: number;
}

export interface RentalOrderResponseDTO {
    id: string;
    clientId: string;
    clientName: string;
    status: RentaslOrderStatus;
    totalAmount: number;
    items: RentalOrderItemResponseDTO[];
    createdAt: string;
}