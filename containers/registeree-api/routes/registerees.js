const express = require("express");
const router = express.Router();

const Registerees = require("../models/registeree");

// endpoints for booth
router.get("/", function(req, res) {
  res.send("Registerees");
});

router.get("/info/:registereeId", function(req, res) {
  res.send("Registeree");
});

router.get("/totalCalories", function(req, res) {
  res.send("Total Calories");
});

router.get("/totalSteps", function(req, res) {
  res.send("Total Steps");
});

router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addRegisteree = new Registerees(req.body);
  res.send("Saved Registeree.");
});

module.exports = router;
