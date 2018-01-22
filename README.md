[![Build Status](https://travis-ci.org/IBM/secret-map-dashboard.svg?branch=master)](https://travis-ci.org/IBM/secret-map-dashboard)

# Secret-map-dashboard map-api

## Getting Started

* Create a MongoDB instance with IBM Cloud
  * [Compose for MongoDB](https://console.bluemix.net/catalog/services/compose-for-mongodb)

* Export credentials in your environment
```
export MONGODB_URL="<your_mongodb_url_found_in_ibmcloud>"
```
Encode your MongoDB's SSL certificate in base64 then export them in your environment
```
echo -n "<paste_your_certificate_here>" | base64

export MONGODB_CERT_BASE64="<paste_the_encoded_result_here>"
```

* Install dependencies and Run the app
```
npm install

npm start
```

* The app will run in `http://localhost:8080`

## Unit tests

* The unit tests will look for a local MongoDB. You can start one easily with Docker.
```
docker run -d -p 27017:27017 --name local-mongo mongo
```

* Run the test script
```
npm test
```

To stop your MongoDB container: `docker stop local-mongo`
To start your MongoDB container back up, simply run: `docker start local-mongo`

To permanently delete the MongoDB container: `docker rm local-mongo`

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

# Secret-map-dashboard front-end

This project was implemented using with [Angular 2 CLI](https://cli.angular.io/)

## Getting Started
```
  cd containers/front-end
  npm install -g @angular/cli
  npm install
  npm start
```
_Application will be served on http://localhost:4200_

## Project Structure 

> Components, directives and services are angular.js terminology

### Componenets 

* Homepage - landing page that shows endpoints for all conferences that are registered  

* Main-dispaly - shows the event name, the event booth blocks with centered text ( which is the Map area componenet), and a footer that displays the total tally number of the distance traveled, the calories burned, and the fitcoins accumlated by conference attendees at a conference. 

* Map-area - displays the event booth blocks with centered text as well as a movement heatmap of the conference attendees

* Side-display -  displays theme related images as well as a running count of the number of steps walked and the number calories burned by the conference attendees at the conference

* Dashboard - contains Main-dispaly and Side-display componenets


> _To create a componenent run this commmand_ `ng generate component < component-name >`

### Services

* Dashboard service - handles all of the http requests towards the map-api server 

> _To create a service run this commmand_ `ng generate service < service-name >`

### Directives 
* Map-area directive - handles the responsiveness of the size and positioning of the event booth blocks in regards to changing of the browser window's size

> _To create a directive run this commmand_ `ng generate directive < directive-name >`

## Syntax Checking
* `npm run lint`  _(checks for typescript syntax)_
 
## E2E tests
* `npm run e2e`

## Unit tests

* `npm run test`
