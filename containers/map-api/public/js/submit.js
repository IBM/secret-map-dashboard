function addBooth() {
    var boothId = document.getElementById('boothId').value
    var unit = document.getElementById('unit').value
    var description = document.getElementById('description').value
    var measurementUnit = document.getElementById('measurementUnit').value
    var xDimension = parseInt(document.getElementById('xDimension').value)
    var yDimension = parseInt(document.getElementById('yDimension').value)
    var x = parseInt(document.getElementById('x').value)
    var y = parseInt(document.getElementById('y').value)
    var contact = document.getElementById('contact').value

    var jsonBody = {
        boothId: '',
        unit: '',
        description: '',
        measurementUnit: '',
        xDimension: null,
        yDimension: null,
        x: null,
        y: null,
        contact: ''
    };

    jsonBody.boothId = boothId;
    jsonBody.unit = unit;
    jsonBody.description = description;
    jsonBody.measurementUnit = measurementUnit;
    jsonBody.xDimension = xDimension;
    jsonBody.yDimension = yDimension;
    jsonBody.x = x;
    jsonBody.y = y;
    jsonBody.contact = contact;
    alert(JSON.stringify(jsonBody));

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/add_booth");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(jsonBody));
}

function addBeacon() {
    var beaconId = document.getElementById('beaconId').value
    var x = parseInt(document.getElementById('x').value)
    var y = parseInt(document.getElementById('y').value)
    var minCount = parseInt(document.getElementById('minCount').value)
    var maxCount = parseInt(document.getElementById('maxCount').value)

    var jsonBody = {
      beaconId: '',
      x: null,
      y: null,
      minCount: null,
      maxCount: null
    };
    jsonBody.beaconId = beaconId;
    jsonBody.x = x;
    jsonBody.y = y;
    jsonBody.minCount = minCount;
    jsonBody.maxCount = maxCount;
    alert(JSON.stringify(jsonBody));

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/add_beacon");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(jsonBody));
}

function addEvent() {
    var eventId = document.getElementById('eventId').value
    var eventDescription = document.getElementById('eventDescription').value
    var location = document.getElementById('location').value
    var startDate = document.getElementById('startDate').value
    var endDate = document.getElementById('endDate').value
    var map = document.getElementById('map').value
    var mapArray = map.split(',').map(function(item) {
      return item.trim();
    });
    var beacons = document.getElementById('beacons').value
    var beaconArray = beacons.split(',').map(function(item) {
      return item.trim();
    });

    var jsonBody = {
      eventId: '',
      eventDescription: '',
      location: '',
      startDate: null,
      endDate: null,
      map: '',
      beacons: ''
    };
    jsonBody.eventId = eventId;
    jsonBody.eventDescription = eventDescription;
    jsonBody.location = location;
    jsonBody.startDate = startDate;
    jsonBody.endDate = endDate;
    jsonBody.map = mapArray;
    jsonBody.beacons = beaconArray;
    alert(JSON.stringify(jsonBody));

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/add_event");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(jsonBody));
}
