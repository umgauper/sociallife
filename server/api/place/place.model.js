'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  location: String,
  place: String,
  users: {}
});

module.exports = mongoose.model('Place', PlaceSchema);
