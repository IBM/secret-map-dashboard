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
const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const path = require('path');
const fs = require("fs");
const cors = require("cors");
const uuidv4 = require('uuid/v4');
import config from './set-up/config';
import invokeFunc from './set-up/invoke';
import queryFunc from './set-up/query';
import {
  OrganizationClient
} from './set-up/client';
const shopClient = new OrganizationClient(config.channelName, config.orderer, config.shopOrg.peer, config.shopOrg.ca, config.shopOrg.admin);
const fitcoinClient = new OrganizationClient(config.channelName, config.orderer, config.fitcoinOrg.peer, config.fitcoinOrg.ca, config.fitcoinOrg.admin);
(async () => {
  try {
    await Promise.all([shopClient.login(), fitcoinClient.login()]);
  } catch(e) {
    console.log('Fatal error logging into blockchain organization clients!');
    console.log(e);
    process.exit(-1);
  };
  await Promise.all([shopClient.initEventHubs(), fitcoinClient.initEventHubs()]);
})();
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.post('/enroll', function(req, res) {
  //console.log(req);
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  //console.log(data);
  //console.log(data.userId);
  console.log(data.orgId);
  var client = null;
  if(!data.orgId) {
    res.json({
      message: "Invalid Org ID"
    });
  } else {
    var userId = uuidv4();
    var client = null;
    if(data.orgId === "shopOrg") {
      client = shopClient;
    } else if(data.orgId === "fitcoinOrg") {
      client = fitcoinClient;
    }
    client.registerAndEnroll(userId).then((user) => {
      console.log("Successfully enrolled user " + userId);
      //console.log(user);
      res.json({
        message: "enrolled",
        data: JSON.stringify({
          user: userId,
          orgId: data.orgId
        })
      });
    }).catch((err) => {
      res.json({
        message: "error",
        data: err
      });
    });
  }
})
app.post('/invoke', function(req, res) {
  //console.log(req);
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var values = typeof data.params !== "string" ? data.params : JSON.parse(data.params);
  //console.log(values);
  //console.log(data);
  //console.log(data.userId);
  console.log(values.orgId + "   " + values.userId);
  var client = null;
  if(!values.orgId || !values.userId) {
    res.json({
      message: "Missing OrgId/UserId "
    });
  } else {
    var userId = uuidv4();
    var client = null;
    if(values.orgId === "shopOrg") {
      client = shopClient;
    } else if(values.orgId === "fitcoinOrg") {
      client = fitcoinClient;
    }
    if(!values.fcn) {
      res.json({
        message: "Missing function name "
      });
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""]
    }
    console.log("Args");
    console.log(values.args);
    invokeFunc(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      console.log("Query Results ");
      console.log(result);
      res.json({
        message: "ok",
        data: result
      });
    });
  }
})
app.post('/query', function(req, res) {
  //console.log(req);
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var values = typeof data.params !== "string" ? data.params : JSON.parse(data.params);
  //console.log(data);
  //console.log(data.userId);
  console.log(values.orgId + "   " + values.userId);
  var client = null;
  if(!values.orgId || !values.userId) {
    res.json({
      message: "Missing OrgId/UserId "
    });
  } else {
    var userId = uuidv4();
    var client = null;
    if(values.orgId === "shopOrg") {
      client = shopClient;
    } else if(values.orgId === "fitcoinOrg") {
      client = fitcoinClient;
    }
    if(!values.fcn) {
      res.json({
        message: "Missing function name "
      });
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""]
    }
    console.log("Args");
    console.log(values.args);
    queryFunc(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      console.log("Query Results ");
      console.log(result);
      res.json({
        message: "ok",
        data: result
      });
    });
  }
})
//app.use(require('./routes'));
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    'errors': {
      message: err.message,
      error: {}
    }
  });
});
module.exports = app;