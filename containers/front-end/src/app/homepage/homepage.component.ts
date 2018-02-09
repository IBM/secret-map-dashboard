import { Component, OnInit } from '@angular/core';
// Services
import { DashboardService } from '../dashboard.service';
// Objects
import { Conference } from '../conference';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  conferences: Conference[];

  constructor(private dashboardService: DashboardService) {
   }

   /**
   * Initializes component by requesting data from the map-api server
   * to populate the homepage component's conferences attribute
   * @param - none
   */
  ngOnInit() {
    this.getConferences();
  }

   /**
   * Get all conferences in map-api server using the Dashboard service
   * @param - none
   */
  getConferences(): void {
    this.dashboardService.getConferences()
    .subscribe(conferences => this.conferences = conferences);
  }

}
