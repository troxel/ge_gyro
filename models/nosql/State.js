const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  gc_time: Number,
  gc_bmc_time: Number,
  gc_mode_num: Number,
  gc_bmc_mode_num: Number,
  gc_mode_str: String,
  roll: Number,
  pitch: Number,
  hdg_true: Number
}, { timestamps: true }); // auto-add createdAt/updatedAt if needed

module.exports = mongoose.model('State', stateSchema);

