const mongoose = require("mongoose");

// eslint-disable-next-line
let registereeSchema = mongoose.Schema({
  registereeId: {type: String, unique: true},
  calories: {type: Number, required: true},
  steps: {type: Number, required: true}
});

module.exports = mongoose.model("Registeree", registereeSchema);