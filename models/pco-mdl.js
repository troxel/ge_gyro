//
const mongoose = require('mongoose')
const { Schema } = mongoose
const uniqueValidator = require('mongoose-unique-validator');

const schema = Schema(
  {
    pcogrp_id:  { type: Number, require: true },
    pcoLbl: {
      type: String,
      required: true,
      unique: true 
    },
    ip: {
        type: String,
        required: true,
        unique: true },
    chnLbl: [String], 
    onDelay: [Number],
    offDelay: [Number],
    reboot: [Number],
    occlude: [Boolean]
  },
  { timestamps: true }
)

schema.plugin(uniqueValidator)

const Model = mongoose.model('pco', schema, 'pco')

module.exports = Model;