const express = require("express");
const router = express.Router();
const uuidv4 = require('uuid/v4');
import config from '../set-up/config';
import invokeFunc from '../set-up/invoke';
import queryFunc from '../set-up/query';
router.post('/enroll', function(req, res, next) {
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var userId = uuidv4();
  var client = req.client;
  client.registerAndEnroll(userId).then((user) => {
    console.log("Successfully enrolled user " + userId);
    //console.log(user);
    res.json({
      message: "success",
      result: JSON.stringify({
        user: userId,
        orgId: data.orgId
      })
    });
  }).catch(err => {
    next(err)
  });
});
router.post('/invoke', function(req, res, next) {
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var values = typeof data.params !== "string" ? data.params : JSON.parse(data.params);
  //console.log(values.orgId + "   " + values.userId);
  if(!values.userId) {
    var err = new Error('Missing UserId');
    err.status = 400;
    next(err);
  } else {
    var userId = uuidv4();
    var client = req.client;
    if(!values.fcn) {
      var err = new Error('Missing function name');
      err.status = 400;
      next(err);
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""]
    }
    invokeFunc(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      console.log("Query Results ");
      console.log(result);
      res.json({
        message: "success",
        result: result
      });
    }).catch(err => {
      next(err);
    });
  }
});
router.post('/query', function(req, res, next) {
  var data = typeof req.body !== "string" ? req.body : JSON.parse(req.body);
  var values = typeof data.params !== "string" ? data.params : JSON.parse(data.params);
  //    console.log(values.orgId + "   " + values.userId);
  if(!values.userId) {
    var err = new Error('Missing UserId');
    err.status = 400;
    next(err);
  } else {
    var userId = uuidv4();
    var client = req.client;
    if(!values.fcn) {
      var err = new Error('Missing function name');
      err.status = 400;
      next(err);
    }
    if(!values.args || (values.args.length == 1 && values.args[0] == null)) {
      values.args = [""]
    }
    queryFunc(values.userId, client, config.chaincodeId, config.chaincodeVersion, values.fcn, values.args).then((result) => {
      console.log("Query Results ");
      console.log(result);
      res.json({
        message: "success",
        result: result
      });
    }).catch(err => {
      next(err);
    });
  }
});
exports.router = router;