export interface RoundCategoryPilotsQualifying {
    id: number;
    pilot: Pilot;
    vehicle: string;
    qualifyings: Qualifying[];
    pilotEvent: PilotEvent;
}

export interface Pilot {
    id: number;
    number: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    nationality: string;
    ffsaLicensee: boolean;
    ffsaNumber: string;
    createdAt: string;
}

export interface Qualifying {
    id: number;
    points: number;
    passage: number;
}

export interface PilotEvent {
    id: number;
    pilotNumber: string;
    receiveWindscreenBand: boolean;
}
