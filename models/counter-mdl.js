const mongoose = require('mongoose')

const schema = new mongoose.Schema({
      id: {
        type: String,
        required: true,
      },
      seq: {
        type: Number,
      }
    }, { timestamps: true })

mdl = mongoose.model('counter',schema)

module.exports = mdl
