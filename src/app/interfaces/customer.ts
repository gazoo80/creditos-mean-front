export interface Customer {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    idCardType: string;
    idCardNumber: string;
    dateOfBirth: Date;
    address?: string;
    rating?: number;
    photo?: string;
    latitude?: string;
    longitude?: string;
}