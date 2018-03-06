const express = require("express");
const router = express.Router();

const Triggers = require("../models/trigger");

// endpoints for beacon
router.post("/add", function(req, res) {
  // JSON in req.body
  // Insert input validation
  let addTrigger = new Triggers(req.body);
  addTrigger.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Saved trigger.");
    }
  });
});

router.get("/", function(req, res) {
  Triggers.find(function(err, triggers) {
    if (err) {
      res.send(err);
    } else {
      res.send(triggers);
    }
  });
});

router.get("/total", function(req, res) {
  Triggers.find(function(err, triggers) {
    if (err) {
      res.send(err);
    } else {
      // res.send(triggers);
      let jsonData = {
        zone_one_enter: 0,
        zone_one_exit: 0,
        zone_two_enter: 0,
        zone_two_exit: 0,
        zone_three_enter: 0,
        zone_three_exit: 0,
        zone_four_enter: 0,
        zone_four_exit: 0,
        zone_five_enter: 0,
        zone_five_exit: 0,
        zone_six_enter: 0,
        zone_six_exit: 0,
        zone_seven_enter: 0,
        zone_seven_exit: 0,
        zone_eight_enter: 0,
        zone_eight_exit: 0,
        zone_nine_enter: 0,
        zone_nine_exit: 0,
        zone_ten_enter: 0,
        zone_ten_exit: 0,
        zone_eleven_enter: 0,
        zone_eleven_exit: 0,
        zone_twelve_enter: 0,
        zone_twelve_exit: 0,
        zone_thirteen_enter: 0,
        zone_thirteen_exit: 0,
        zone_fourteen_enter: 0,
        zone_fourteen_exit: 0,
        zone_fifteen_enter: 0,
        zone_fifteen_exit: 0
      };
      triggers.forEach(function(trigger) {
        if (trigger.zone == 1 && trigger.event == "enter") {
          jsonData.zone_one_enter += 1;
        }
        if (trigger.zone == 1 && trigger.event == "exit") {
          jsonData.zone_one_exit += 1;
        }
        if (trigger.zone == 2 && trigger.event == "enter") {
          jsonData.zone_two_enter += 1;
        }
        if (trigger.zone == 2 && trigger.event == "exit") {
          jsonData.zone_two_exit += 1;
        }
        if (trigger.zone == 3 && trigger.event == "enter") {
          jsonData.zone_three_enter += 1;
        }
        if (trigger.zone == 3 && trigger.event == "exit") {
          jsonData.zone_three_exit += 1;
        }
        if (trigger.zone == 4 && trigger.event == "enter") {
          jsonData.zone_four_enter += 1;
        }
        if (trigger.zone == 4 && trigger.event == "exit") {
          jsonData.zone_four_exit += 1;
        }
        if (trigger.zone == 5 && trigger.event == "enter") {
          jsonData.zone_five_enter += 1;
        }
        if (trigger.zone == 5 && trigger.event == "exit") {
          jsonData.zone_five_exit += 1;
        }
        if (trigger.zone == 6 && trigger.event == "enter") {
          jsonData.zone_six_enter += 1;
        }
        if (trigger.zone == 6 && trigger.event == "exit") {
          jsonData.zone_six_exit += 1;
        }
        if (trigger.zone == 7 && trigger.event == "enter") {
          jsonData.zone_seven_enter += 1;
        }
        if (trigger.zone == 7 && trigger.event == "exit") {
          jsonData.zone_seven_exit += 1;
        }
        if (trigger.zone == 8 && trigger.event == "enter") {
          jsonData.zone_eight_enter += 1;
        }
        if (trigger.zone == 8 && trigger.event == "exit") {
          jsonData.zone_eight_exit += 1;
        }
        if (trigger.zone == 9 && trigger.event == "enter") {
          jsonData.zone_nine_enter += 1;
        }
        if (trigger.zone == 9 && trigger.event == "exit") {
          jsonData.zone_nine_exit += 1;
        }
        if (trigger.zone == 10 && trigger.event == "enter") {
          jsonData.zone_ten_enter += 1;
        }
        if (trigger.zone == 10 && trigger.event == "exit") {
          jsonData.zone_ten_exit += 1;
        }
        if (trigger.zone == 11 && trigger.event == "enter") {
          jsonData.zone_eleven_enter += 1;
        }
        if (trigger.zone == 11 && trigger.event == "exit") {
          jsonData.zone_eleven_exit += 1;
        }
        if (trigger.zone == 12 && trigger.event == "enter") {
          jsonData.zone_twelve_enter += 1;
        }
        if (trigger.zone == 12 && trigger.event == "exit") {
          jsonData.zone_twelve_exit += 1;
        }
        if (trigger.zone == 13 && trigger.event == "enter") {
          jsonData.zone_thirteen_enter += 1;
        }
        if (trigger.zone == 13 && trigger.event == "exit") {
          jsonData.zone_thirteen_exit += 1;
        }
        if (trigger.zone == 14 && trigger.event == "enter") {
          jsonData.zone_fourteen_enter += 1;
        }
        if (trigger.zone == 14 && trigger.event == "exit") {
          jsonData.zone_fourteen_exit += 1;
        }
        if (trigger.zone == 15 && trigger.event == "enter") {
          jsonData.zone_fifteen_enter += 1;
        }
        if (trigger.zone == 15 && trigger.event == "exit") {
          jsonData.zone_fifteen_exit += 1;
        }
      });
      res.send(jsonData);
    }
  });
});

module.exports = router;
