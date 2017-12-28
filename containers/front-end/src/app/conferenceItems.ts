export class Booth {
    boothId: string;
    unit: string;
    description: string;
    measurementUnit: string;
    xDimension: number;
    yDimension: number;
    x: number;
    y: number;
    contact: string;
}

export class Beacon {
    beaconId: string;
    x: number;
    y: number;
    minCount: number;
    maxCount: number;
}
