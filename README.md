[![Build Status](https://travis-ci.org/IBM/secret-map-dashboard.svg?branch=master)](https://travis-ci.org/IBM/secret-map-dashboard)

# secret-map-dashboard map-api

```
npm install
```

#### Endpoints

Beacons
* Getting list of beacons: http://localhost:8080/beacons
* Getting a specific beacon: http://localhost:8080/beacons/:beaconId
* Adding a beacon: http://localhost:8080/beacons/add
> POST request with JSON body

Example of adding a beacon:
```
curl -X POST -H 'Content-Type: application/json' -d '{ "beaconId": "B01", "x": 1, "y": 1, "minCount": 0, "maxCount": 100}' http://localhost:8080/beacons/add
```

Booths
* Getting list of booths: http://localhost:8080/booths
* Getting a specific booth: http://localhost:8080/booths/:boothId
* Adding a booth: http://localhost:8080/booths/add
> POST request with JSON body

Example of adding a booth:
```
curl -X POST -H 'Content-Type: application/json' -d '{ "boothId": "A22", "unit": "swift", "description": "swift booth description", "measurementUnit": "metre", "shape": {"type": "circle","cx":5, "cy": 5, "radius": 10}, "contact": "Jane Doe"}' http://localhost:8080/booths/add
```

Booths
* Getting list of events: http://localhost:8080/events
* Getting a specific event: http://localhost:8080/events/:eventId
* Adding an event: http://localhost:8080/events/add
> POST request with JSON body

Example of adding an event:
```
curl -X POST -H 'Content-Type: application/json' -d '{ "eventId":"index","eventName":"Index","location":"San Francisco","startDate":"2018-02-20","endDate":"2018-02-24", beacons: "B01,B02,B03,B04", map:"A01,A02,A03,A04,A05,A06,A07"}' http://localhost:8080/events/add
```

# secret-map-dashboard front-end client

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.1.

```
npm install

npm install -g @angular/cli

npm start

```
