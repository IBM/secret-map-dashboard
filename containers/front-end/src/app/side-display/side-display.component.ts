import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-display',
  templateUrl: './side-display.component.html',
  styleUrls: ['./side-display.component.css']
})
export class SideDisplayComponent implements OnInit {
  @Input() steps: number;
  @Input() calories: number;
  @Input() conferenceAttendees: number;
  @Input() totalDistance: number;

  constructor() {

   }

   /**
   * Initializes component
   */
  ngOnInit() {
  }

}
