/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
'use strict';
//const express = require('express'); // app server
//const bodyParser = require('body-parser'); // parser for post requests
//const cors = require("cors");
const request = require('request');
const peer = require('./utils/peer');
const utils = require('./utils/util');
(async () => {
  try {
    await peer.initiateClient();
  } catch(e) {
    console.log('Fatal error initiating organization clients!');
    console.log(e);
    process.exit(-1);
  }
  //const apiRoute = require("./routes/api");
  //const app = express();
  var socketPort = process.env.SOCKETPORT || 3030;
  var io = require('socket.io')(socketPort);
  var blockEvent = io.of('/block');
  blockEvent.on('connection', function (socket) {
    console.log("Connect on block");
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('error', function () {
      console.log('Error : Socket connection');
    });
  });
  peer.clients[0].on('block', block => {
    blockEvent.emit('block', JSON.stringify(block));
    iotDashboard(block); // pass block contents to iot dashboard
  });
  utils.createConnection(peer.clients);
  var executeEvent = io.of('/execute');
  executeEvent.on('connection', function (socket) {
    console.log("Connect on block");
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
    socket.on('error', function () {
      console.log('Error : Socket connection');
    });
    socket.on('exec', function (params) {
      //console.log("received params");
      //console.log(params);
      utils.queueRequest(params, executeEvent);
    });
  });

  // pass params to iot dashboard
  function iotDashboard(data) {
    var options = {
      method: 'GET',
      uri: 'https://secretmap.mybluemix.net/steps?message='+JSON.stringify(data)
    }

    request(options, function (error, response, body) {
      console.log('error:', error); // null if no error occurs, else print error
      console.log('statusCode:', response && response.statusCode); // print the response status code
      console.log('body:', body); // print the output body on console
    });

  }

  /*app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(function (req, res, next) {
    req.client = peer.clients[0];
    next();
  });
  app.use("/api", require("./routes/api").router);
  /// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.json({
      'errors': {
        message: err.message,
        error: {}
      }
    });
  });
  const port = process.env.PORT || process.env.VCAP_APP_PORT || 3002;
  app.listen(port, function () {
    console.log('Server running on port: %d', port);
  });*/
})();
