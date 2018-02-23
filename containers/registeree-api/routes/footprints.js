const express = require("express");
const router = express.Router();

// const Footprints = require("../models/footprint");

// endpoints for booth
router.get("/", function(req, res) {
  res.send("Footprints");
});

router.get("/:footprintId", function(req, res) {
  res.send("Footprint");
});

router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  res.send("Saved Footprint.");
});

router.post("/remove/:footprintId", function(req, res) {
  // JSON in req.body
  // Insert input validation
  res.send("Removed Footprint.");
});

module.exports = router;
