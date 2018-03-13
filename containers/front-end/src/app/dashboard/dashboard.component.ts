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
  conferenceAttendees: number;  // Will change to an array of Conference Attendees
  totalDistance: number;
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
    this.conferenceAttendees = 0;  // initialization will change to getConferenceAttendees()
    this.totalDistance = 0;
    this.getSideDisplayInfo();
    this.getConference();
  }

   /**
   * Get conference by eventId in map-api server using the Dashboard service
   */
  getConference(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    this.dashboardService.getConference(eventId)
    .subscribe( conference => {
      this.conference = conference;
      console.log(this.conference);
    });
  }

   /**
   * Increments the values of steps, calories and fitcoins every 2 seconds by
   * a certain value
   */
  getSideDisplayInfo(): void {
    this.sideDisplayInterval = setInterval(() => {
      // this.steps += (4 * this.conferenceAttendees);
      this.getTotalSteps();
      this.calories = Math.floor(this.steps / 20);
      this.totalDistance = Math.floor(this.steps / 1320);
      this.getTotalUsers();
    }
    , 1000);
  }

  /**
* Increments the value of conferenceAttendees every second by 4
*/
  getTotalSteps(): void {
    this.dashboardService.getTotalSteps()
      .subscribe(steps => {
        this.steps = steps[0]['count'];
      });
  }

/**
* Increments the value of conferenceAttendees every second by 4
*/
  getTotalUsers(): void {
    this.dashboardService.getTotalUsers()
      .subscribe(users => {
        this.conferenceAttendees = users['count'];
      });
  }

}
