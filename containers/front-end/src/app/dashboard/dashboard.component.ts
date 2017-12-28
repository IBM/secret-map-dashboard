import { Component, OnInit } from '@angular/core';
import {setInterval} from 'timers';
import { Conference } from '../conference';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  conferences: Conference[];
  steps: number;
  calories: number;
  fitcoins: number;
  conferenceAttendees: number;  // Will change to an array of Conference Attendees
  sideDisplayInterval: any;
  MainDisplayInterval: any;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.steps = 0;
    this.calories = 0;
    this.fitcoins = 0;
    this.conferenceAttendees = 0;  // initialization will change to getConferenceAttendees()
    this.getConferences();
    this.getSideDisplayInfo();
    this.getConferenceAttendees();
  }

  getConferences(): void {
    this.dashboardService.getConferences()
    .subscribe(conferences => this.conferences = conferences);
  }

  // Implementation will be swapped with http calls from
  // dashboardService.getSideDisplayInfo()
  getSideDisplayInfo(): void {
    this.sideDisplayInterval = setInterval(() => {
      this.steps += 10;
      this.calories += 2;
      this.fitcoins += 2;
    }
    , 2000);
  }

  // Implementation will be swapped with http calls from
  // dashboardService.getConferenceAttendees()
  getConferenceAttendees(): void {
    this.MainDisplayInterval = setInterval(() => {
      this.conferenceAttendees += 4;
    }, 1000);
  }

}
