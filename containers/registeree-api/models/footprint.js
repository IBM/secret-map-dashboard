const mongoose = require("mongoose");

// eslint-disable-next-line
let footprintSchema = mongoose.Schema({
  footprintId: {type: String, unique: true},
  x: Number,
  y: Number,
});

module.exports = mongoose.model("Footprint", footprintSchema);