import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Components
import { MainDisplayComponent } from './main-display.component';
import { MapAreaComponent } from '../map-area/map-area.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
// Directives
import { MapAreaDirective } from '../map-area.directive';
// Objects
import { Conference } from '../conference';

describe('MainDisplayComponent', () => {
  let component: MainDisplayComponent;
  let fixture: ComponentFixture<MainDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDisplayComponent,
      MapAreaComponent,
      MapAreaDirective,
      HeatmapComponent
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
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
