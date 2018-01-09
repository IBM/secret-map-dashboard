import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Conference } from '../conference';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrls: ['./main-display.component.css']
})
export class MainDisplayComponent implements OnChanges {

  @Input() steps: number;
  @Input() conferenceAttendees: number;
  @Input() fitcoins: number;
  @Input() conference: Conference;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conference']) {
      this.getConference(this.conference);
    }
  }

  getConference(conference: Conference): Conference {
    if (!conference) {
      return;
    }
    return conference;
  }

}
