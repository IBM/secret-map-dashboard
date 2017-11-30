var mongoose = require('mongoose');

var boothSchema = mongoose.Schema({
    boothId: { type: String, unique: true },
    unit: String,
    description: String,
    measurementUnit: String,
    xDimension: Number,
    yDimension: Number,
    x: Number,
    y: Number,
    contact: String
});

module.exports = mongoose.model('Booth', boothSchema);
