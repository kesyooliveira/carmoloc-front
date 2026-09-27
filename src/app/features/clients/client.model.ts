export type ClientDocumentType = 'CPF' | 'CNPJ';

export interface AddressDTO {
    street?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    zipCode?: string | null;
}

export interface ClientRequestDTO {
    name: string,
    documentType: ClientDocumentType,
    document: string,
    phone: string,
    email?: string,
    description?: string,
    address: AddressDTO
}

export interface ClientResponseDTO {
    id: string;
    name: string;
    documentType: ClientDocumentType;
    document: string;
    phone: string;
    email?: string;
    description?: string;
    address?: AddressDTO;
    active: boolean;
    createdAt: string;
}