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
const config = require('./set-up/config');
const request = require('request');
const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const cors = require("cors");
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
  if(process.env.EVENTEMITTER === "true") {
    console.log("Starting socker server");
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
    peer.clients.eventEmitter.on('block', block => {
      blockEvent.emit('block', JSON.stringify(block));
      //sendToIoTDashboard(JSON.stringify(block));
    });
    // pass params to iot dashboard
    function sendToIoTDashboard(data) {
      var options = {
        method: 'GET',
        uri: config.iotDashUrl + data
      };
      request(options, function (error, response, body) {
        console.log('error:', error); // null if no error occurs, else print error
        console.log('statusCode:', response && response.statusCode); // print the response status code
        console.log('body:', body); // print the output body on console
      });
    }
  }
  utils.createConnection(peer.clients.workers);
})();