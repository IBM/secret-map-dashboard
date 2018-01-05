import {Booth, Beacon} from './conferenceItems';

export class Conference {
    eventId: string;
    eventName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    map: Booth[];
    beacons: Beacon[];
}
