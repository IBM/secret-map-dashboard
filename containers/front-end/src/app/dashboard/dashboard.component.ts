import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {setInterval} from 'timers';
// Services
import { DashboardService } from '../dashboard.service';
// Objects
import { Conference } from '../conference';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  steps: number;
  calories: number;
  fitcoins: number;
  conferenceAttendees: number;  // Will change to an array of Conference Attendees
  sideDisplayInterval: any;
  MainDisplayInterval: any;
  conference: Conference;

   /**
   * Constructor for dashboard component
   * @param  dashboardService - for requesting conference data from map-api
   * @param route - routing information
   */
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute) {

     }

   /**
   * Initializes component
   * @param - none
   */
  ngOnInit() {
    this.steps = 0;
    this.calories = 0;
    this.fitcoins = 0;
    this.conferenceAttendees = 0;  // initialization will change to getConferenceAttendees()
    this.getSideDisplayInfo();
    this.getConferenceAttendees();
    this.getConference();
  }

   /**
   * Get conference by eventId in map-api server using the Dashboard service
   * @param - none
   */
  getConference(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    this.dashboardService.getConference(eventId)
    .subscribe( conference => this.conference = conference);
  }

   /**
   * Increments the values of steps, calories and fitcoins every 2 seconds by
   * a certain value
   * @param - none
   */
  getSideDisplayInfo(): void {
    this.sideDisplayInterval = setInterval(() => {
      this.steps += 10;
      this.calories += 2;
      this.fitcoins += 2;
    }
    , 2000);
  }

   /**
   * Increments the value of conferenceAttendees every second by 4
   * @param - none
   */
  getConferenceAttendees(): void {
    this.MainDisplayInterval = setInterval(() => {
      this.conferenceAttendees += 4;
    }, 1000);
  }

}
