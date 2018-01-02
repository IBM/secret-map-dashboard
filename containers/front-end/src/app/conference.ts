import {Booth, Beacon} from './conferenceItems';

export class Conference {
    eventId: string;
    eventDescription: string;
    location: string;
    startDate: Date;
    endDate: Date;
    map: Booth[];
    beacons: Beacon[];
}
