import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDisplayComponent } from './main-display.component';
import { MapAreaDirective } from '../map-area.directive';
import { MapAreaComponent } from '../map-area/map-area.component';
import { Conference } from '../conference';
import { SimpleChange } from '@angular/core/';


describe('MainDisplayComponent', () => {
  let component: MainDisplayComponent;
  let fixture: ComponentFixture<MainDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDisplayComponent,
      MapAreaComponent,
      MapAreaDirective,
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDisplayComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    component.conference = {
      'eventId': 'E01',
      'eventName': 'Index',
      'location': 'San Francisco',
      'startDate': new Date( '2018-02-20T00:00:00.000Z' ),
      'endDate': new Date( '2018-02-24T00:00:00.000Z' ),
      'beacons': [
        {
          'maxCount': 100,
          'minCount': 1,
          'y': 5,
          'x': 2,
          'beaconId': 'B01'
        }
      ],
      'map': [
          {
            'contact': 'John Doe',
            'shape': {'width': 3, 'height': 3, 'x': 3, 'y': 3},
            'measurementUnit': 'metre',
            'description': 'Node description',
            'boothId': 'A01'
          }
      ]
    };
    component.ngOnChanges({
        conference: new SimpleChange(null, component.conference, true)
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
