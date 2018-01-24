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
router.get('/blocks', function(req, res, next) {
  const values = req.query;
  if(!values.noOfLastBlocks || (values.noOfLastBlocks && isNaN(values.noOfLastBlocks))) {
    var err = new Error('Invalid value for number of blocks');
    err.status = 400;
    next(err);
  } else {
    var client = req.client;
    client.getBlocks(Number(values.noOfLastBlocks)).then((results) => {
      res.json({
        message: "success",
        result: JSON.stringify({
          result: results
        })
      });
    }).catch(err => {
      next(err)
    });
  }
});
exports.router = router;