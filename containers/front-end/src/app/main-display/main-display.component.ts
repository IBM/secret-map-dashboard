import { Component, Input, OnInit } from '@angular/core';
// Objects
import { Conference } from '../conference';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.css']
})
export class MainDisplayComponent implements OnInit {
  @Input() conference: Conference;
  constructor() {
  }

   /**
   * Initializes component
   * @param - none
   */
  ngOnInit() {
  }

}
