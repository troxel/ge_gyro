const mongoose = require('mongoose');

const attitudeSchema = new mongoose.Schema({
  time: { type: Number, required: true }, // Unix epoch time (seconds)
  roll: Number,
  pitch: Number,
  yaw: Number
});

module.exports = mongoose.model('Attitude', attitudeSchema);

