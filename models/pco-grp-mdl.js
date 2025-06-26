//
const mongoose = require('mongoose')
const { Schema } = mongoose;

const uniqueValidator = require('mongoose-unique-validator')
const slugify = require('slugify')

const schema = Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Enforce unique titles using a unique index
    },
    slug: String,
    description: String,
    pcogrp_id: Number
  },
  { timestamps: true }
);

// Use a pre-save hook to generate and set the slug
schema.pre('save', async function (next) {
  if (!this.isModified('title')) {
    return next();
  }

  this.slug = slugify(this.title, '_');
  console.log('Generated slug:', this.slug);

  return next();
})

schema.plugin(uniqueValidator)

const Model = mongoose.model('pcogrps', schema)

module.exports = Model;