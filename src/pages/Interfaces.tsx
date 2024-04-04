export interface Canteen {
    name: string;
    address: Address;
    id: string;
    businessDays: object[];
    universities: string[];
}

export interface Address {
    street: string;
    city: string;
    zipcode: string;
    district: string;
    geoLocation: {
        longitude: number;
        latitude: number;
    };
}

export interface Menu {
    date: string;
    canteenId: string;
    meals: Meal[];
}

export interface Meal {
    id: string;
    name: string;
    prices: Price[];
    category: string;
    additives: Additive[];
    badges: Badge[];
    waterBilanz: number;
    co2Bilanz: number;
}

export interface Price {
    priceType: string;
    price: number;
}

export interface Additive {
    id: string;
    text: string;
    referenceid: string;
}

export interface Badge {
    ID: string;
    name: string;
    description: string;
}