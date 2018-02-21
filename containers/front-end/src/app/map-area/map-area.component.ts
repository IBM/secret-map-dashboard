import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
// Directives
import { MapAreaDirective } from '../map-area.directive';
// Objects
import {Booth, Beacon} from '../conferenceItems';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.css']
})
export class MapAreaComponent implements OnInit {

  @Input() booths: Booth[];
  @Input() beacons: Beacon[];
  @Input() eventName: string;

  /**
   * Constructor for the map-area component
   * @param el - HTML element
  */
  constructor(private el: ElementRef) {
   }

   /**
   * Initializes component
   */
  ngOnInit() {
  }

}
