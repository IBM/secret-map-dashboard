import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Conference } from '../conference';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  conferences: Conference[]; 

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getConferences();
  }


  getConferences(): void {
    this.dashboardService.getConferences()
    .subscribe(conferences => this.conferences = conferences);
  }

}
