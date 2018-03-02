const express = require("express");
const router = express.Router();

const Footprints = require("../models/footprint");

// endpoints for booth
router.get("/", function(req, res) {
  Footprints.find(function(err, footprints) {
    if(err){
      res.send(err);
    } else {
      res.send(footprints);
    }
  });
});

router.get("/:footprintId", function(req, res) {
  Footprints.findOne(req.params, function(err, footprint) {
    if(err){
      res.send(err);
    } else if(footprint) {
      res.send(footprint);
    } else {
      res.send("Footprint not found.");
    }
  });
});

router.post("/add", function(req, res) {
  let addFootprint = new Footprints(req.body);
  addFootprint.save(function(err){
    if(err){
      res.send(err);
    } else {
      res.send('Saved footprint.');
    }
  });
});

router.post("/remove/:footprintId", function(req, res) {
  Footprints.deleteOne(req.params, function(err) {
    if(err) {
      res.send(err);
    }
    else{
      res.send('Delete footprint.');
    }
  });
});

module.exports = router;
