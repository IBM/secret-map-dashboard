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
  @Input() conferences: Conference[];
  conference: Conference;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['conferences']) {
      this.conference = this.getConference(this.conferences);
    }
  }

  getConference(conferences: Conference[]): Conference {
    if (!conferences) {
      return;
    }
    return conferences.map(x => x)[0];
  }

}
