import { Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';

import {Booth, Beacon} from '../conferenceItems';
import { MapAreaDirective } from '../map-area.directive';

@Component({
  selector: 'app-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.css']
})
export class MapAreaComponent implements OnInit {

  @Input() booths: Booth[];
  @Input() beacons: Beacon[];

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

}
