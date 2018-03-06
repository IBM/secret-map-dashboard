const mongoose = require("mongoose");

// eslint-disable-next-line
let footprintSchema = mongoose.Schema({
  footprintId: {type: String, unique: true},
  x: {type: Number, required: true},
  y: {type: Number, required: true},
});

module.exports = mongoose.model("Footprint", footprintSchema);