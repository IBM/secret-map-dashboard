export class Booth {
    boothId: string;
    description: string;
    measurementUnit: string;
    shape: object;
    contact: string;
}

export class Beacon {
    beaconId: string;
    x: number;
    y: number;
    minCount: number;
    maxCount: number;
}
