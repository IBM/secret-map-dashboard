import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService],
      imports: [HttpClientTestingModule]
    });
    injector = getTestBed();
    service = injector.get(DashboardService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#initialization', () =>{
    it('should create a DashboardService instance', inject([DashboardService], (service: DashboardService) => {
      expect(service).toBeTruthy();
    }));
  })


  describe('#getConferences', () => {
    it('should return an Observable<Conference[]>', () => {
      const dummyConferences= [
        {
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
        }
      ];
  
      service.getConferences().subscribe(conferences => {
        expect(conferences.length).toBe(1);
        expect(conferences).toEqual(dummyConferences);
      });
  
      const req = httpMock.expectOne(`${service.API_URL}/events`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyConferences);
    });
  });


  describe('#getConference', () => {

    it('should return an Observable<Conference>', () => {
      service.getConference('index')
      .subscribe(result => {
        expect(result.eventName).toEqual("Index");
      });

      const req = httpMock.expectOne(`${service.API_URL}/events/index`);
      expect(req.request.url).toBe(`${service.API_URL}/events/index`);
      expect(req.request.method).toBe("GET");
    
      req.flush({
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
      });
    });
  });


});
