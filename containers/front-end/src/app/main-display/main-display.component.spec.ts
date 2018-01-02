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
    component.conferences = [
    {
      'eventId': 'E01',
      'eventDescription': 'Index',
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
            'y': 0,
            'x': 0,
            'yDimension': 3,
            'xDimension': 3,
            'measurementUnit': 'metre',
            'description': 'Node description',
            'unit': 'Node',
            'boothId': 'A01'
          }
      ]
    }];
    component.ngOnChanges({
        conferences: new SimpleChange(null, component.conferences, true)
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
