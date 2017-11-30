var express = require('express');
var app = express();
var mongoose = require('mongoose');
var assert = require('assert');
var fs = require('fs');

var request = require('request');

var Booths = require('./models/booth');
var Beacons = require('./models/beacon');
var Events = require('./models/event');

var mongoDbUrl = process.env.MONGODB_URL;
if (process.env.MONGODB_CERT_BASE64) {
    var ca = new Buffer(process.env.MONGODB_CERT_BASE64, 'base64');
}
else {
    var ca = [ fs.readFileSync("/etc/ssl/mongo.cert") ];
}

var mongoDbOptions = {
    mongos: {
      useMongoClient: true,
      ssl: true,
      sslValidate: true,
      sslCA: ca
    }
}

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('open', function (err) {
    console.log("CONNECTED...")
    assert.equal(null, err);
});

mongoose.connect(mongoDbUrl, mongoDbOptions);

app.use(require('body-parser').json());

app.use(express.static(__dirname + '/public'));


app.get('/booth', function(req,res) {
    res.sendFile(__dirname + '/public/addBooth.html');
})

app.get('/beacon', function(req,res) {
    res.sendFile(__dirname + '/public/addBeacon.html');
})

app.get('/event', function(req,res) {
    res.sendFile(__dirname + '/public/addEvent.html');
})

// endpoints for booth
app.post('/add_booth', function(req,res) {
    // JSON in req.body
    // Insert input validation
    var addBooth = new Booths(req.body);
    addBooth.save(function (err) {
        if (err) {
            res.send('Error saving: ' + err)
            return console.error(err);
        }
        else {
            res.send('Saved booth.')
        }
    });
})

app.get('/get_booths', function(req,res) {
    Booths.find(function(err, booths) {
        if (err) {
            res.send('Error getting booths: ' + err);
            return console.error(err);
        }
        else {
            res.send(booths);
        }
    })
});

app.get('/get_booth/:boothId', function(req,res) {
    Booths.findOne(req.params, function(err, booth) {
        if (err) {
            res.send('Error getting booth: ' + err);
            return console.error(err);
        }
        else if (booth){
            res.send(booth);
        }
        else {
            res.send("Booth not found...")
        }
    });
});

// endpoints for beacon
app.post('/add_beacon', function(req,res) {
    // JSON in req.body
    // Insert input validation
    var addBeacon = new Beacons(req.body);
    addBeacon.save(function (err) {
        if (err) {
            res.send('Error saving: ' + err)
            return console.error(err);
        }
        else {
            res.send('Saved beacon.')
        }
    });
})

app.get('/get_beacons', function(req,res) {
    Beacons.find(function(err, beacons) {
        if (err) {
            res.send('Error getting beacons: ' + err);
            return console.error(err);
        }
        else {
            res.send(beacons);
        }
    })
});

app.get('/get_beacon/:beaconId', function(req,res) {
    Beacons.findOne(req.params, function(err, beacon) {
        if (err) {
            res.send('Error getting beacon: ' + err);
            return console.error(err);
        }
        else if (beacon){
            res.send(beacon);
        }
        else {
            res.send("Beacon not found...")
        }
    });
});


// {"event":"index",
// "location":"san francisco",
// "start date":"Feb 20, 2018",
// "end date": "Feb 24, 2018",
// "map":[{booth},{booth}],
// "beacons":[]}

// endpoints for event
app.post('/add_event', function(req,res) {
    // JSON in req.body
    // Insert input validation
    var boothIds = req.body.map
    var beaconIds = req.body.beacons
    console.log("req.body.map = " + boothIds);
    var testJson = [];

    var queryBooth = Booths.find({"boothId": {$in : boothIds}}, function(err, booths) {
        if (err) {
            res.send('Error getting booths: ' + err);
            return console.error(err);
        }
        else {
            req.body.map = booths;
        }
    });
    var queryBeacon = Beacons.find({"beaconId": {$in : beaconIds}}, function(err, beacons) {
        if (err) {
            res.send('Error getting beacons: ' + err);
            return console.error(err);
        }
        else {
            req.body.beacons = beacons;
        }
    })

    queryBooth.then(queryBeacon)
    .then(function () {
        console.log(req.body)
        var addEvent = new Events(req.body);
        addEvent.save(function (err) {
            if (err) {
                res.send('Error saving: ' + err)
                return console.error(err);
            }
            else {
                res.send('Saved event.')
            }
        });
    })

})

app.get('/get_events', function(req,res) {
    Events.find(function(err, events) {
        if (err) {
            res.send('Error getting events: ' + err);
            return console.error(err);
        }
        else {
            res.send(events);
        }
    })
});

app.get('/get_event/:eventId', function(req,res) {
    Events.findOne(req.params, function(err, event) {
        if (err) {
            res.send('Error getting event: ' + err);
            return console.error(err);
        }
        else if (beacon){
            res.send(event);
        }
        else {
            res.send("Event not found...")
        }
    });
});

// render data
app.get('/booth/list', function(req,res) {
    var booth_list = '';
    Booths.find(function(err, booths) {
        if (err) {
            res.send('Error getting booths: ' + err);
            return console.error(err);
        }
        else {
            for(var boothIndex in booths) {
                var boothId = '<p>Booth ID: ' + booths[boothIndex].boothId + '</p>'
                var unit = '<p>Booth Unit: ' + booths[boothIndex].unit + '</p>'
                var description = '<p>Booth Description: ' + booths[boothIndex].description + '</p>'
                var measurementUnit = '<p>Measurement Unit: ' + booths[boothIndex].measurementUnit + '</p>'
                var xDimension = '<p>Length: ' + booths[boothIndex].xDimension + '</p>'
                var yDimension = '<p>Width: ' + booths[boothIndex].yDimension + '</p>'
                var x = '<p>X-coordinate: ' + booths[boothIndex].x + '</p>'
                var y = '<p>Y-coordinate: ' + booths[boothIndex].y + '</p>'
                var contact = '<p>Contact Person: ' + booths[boothIndex].contact + '</p><p>===============</p>'
                var compiled = boothId + unit + description + measurementUnit + xDimension + yDimension + x + y + contact
                booth_list += compiled;
            }
            res.send(html_template(booth_list));
        }
    })
});

app.get('/beacon/list', function(req,res) {
    var beacon_list = '';
    Beacons.find(function(err, beacons) {
        if (err) {
            res.send('Error getting beacons: ' + err);
            return console.error(err);
        }
        else {
            for(var beaconIndex in beacons) {
                var beaconId = '<p>Beacon ID: ' + beacons[beaconIndex].beaconId + '</p>'
                var x = '<p>X-coordinate: ' + beacons[beaconIndex].x + '</p>'
                var y = '<p>Y-coordinate: ' + beacons[beaconIndex].y + '</p>'
                var minCount = '<p>Minimum Count: ' + beacons[beaconIndex].minCount + '</p>'
                var maxCount = '<p>Maximum Count: ' + beacons[beaconIndex].maxCount + '</p><p>===============</p>'
                var compiled = beaconId + x + y + minCount + maxCount
                beacon_list += compiled;
            }
            res.send(html_template(beacon_list));
        }
    })
});

function html_template(list)  {

var html = '<html> \
<head> \
<title>Lists</title> \
</head> \
<body> \
<a href="/">Home</a> / <a href="/booth">Add Booth</a> / <a href="/beacon">Add Beacon</a> / <a href="/event">Add Event</a> \
/ <a href="/booth/list">Booth List</a> / <a href="/beacon/list">Beacon List</a> / <a href="/event/list">Event List</a><br /> \
Hello, Lists! <p>===============</p>' + list +
'</body> \
</html> \
';

return html;
}

var port = process.env.PORT || 8080
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
