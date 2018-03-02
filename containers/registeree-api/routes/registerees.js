const express = require("express");
const router = express.Router();

const Registerees = require("../models/registeree");

// endpoints for registeree
router.get("/", function(req, res) {
  Registerees.find(function(err, registerees){
    if(err){
      res.send(err);
    }
    else{
      res.send(registerees);
    }
  })
});

router.get("/info/:registereeId", function(req, res) {
  Registerees.findOne(req.params, function(err, registeree) {
    if(err){
      res.send(err);
    } else if(registeree){
      res.send(registeree);
    } else {
      res.send('Registeree not found...')
    }
  })
});

router.get("/totalCalories", function(req, res) {
  Registerees.aggregate([{ $group: 
    { _id: null, 
      count: { 
        $sum: "$calories"
      }  
    } 
  }], function(err, totalCalories) {
    if(err) {
      res.send(err)
    } else if(totalCalories){
      res.send(totalCalories);
    } else {
      res.send("Registeree.calories not found")
    }
  });
});

router.get("/totalSteps", function(req, res) {
  Registerees.aggregate([{ $group: 
    { _id: null, 
      count: { 
        $sum: "$steps"
      }  
    } 
  }], function(err, totalSteps) {
    if(err) {
      res.send(err)
    } else if(totalSteps){
      res.send(totalSteps);
    } else {
      res.send("Registeree.steps not found")
    }
  });
});

router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addRegisteree = new Registerees(req.body);

  addRegisteree.save( function(err) {
    if(err){
      res.send(err);
    }
    else {
      res.send("Saved Registeree.");
    }
  });
});

module.exports = router;
