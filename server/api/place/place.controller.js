'use strict';

var _ = require('lodash');
var Place = require('./place.model');

// Get list of places
exports.index = function(req, res) {
  Place.find(function (err, places) {
    if(err) { return handleError(res, err); }
    return res.json(200, places);
  });
};

// Get a single place
exports.show = function(req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    return res.json(place);
  });
};

//Show all places for a location

exports.showPlaces = function(req, res) {
  Place.find({location: req.params.location}, function(err, places) {
    if (err) { return handleError(res, err); }
    if(!places) { return res.send(404); }
    return res.json(places);
  })
};

//show a specific place
exports.showPlace = function(req, res) {
  Place.find({location: req.params.location, place: req.params.place}, function(err, place){
    if (err) { return handleError(res, err); }
    if(!place) { return res.send(200)}
    return res.json(place)
  })
};

// Creates a new place in the DB.
exports.create = function(req, res) {
  Place.create(req.body, function(err, place) {
    if(err) { return handleError(res, err); }
    return res.json(201, place);
  });
};

// Updates an existing place in the DB.
exports.update = function(req, res) {
  //console.log(req.params, req.body);
  var update = {$push: {users: req.body.user}}; //this is adding null to the users array...

  //if(req.body._id) { delete req.body._id; }

  Place.update({_id: req.params.id}, update, function(err) {
    if(err) { return handleError(res, err); }
    return res.send(200);
  });

};

// Remove a user from a users array

exports.removeUser = function(req, res) {
  var update = {$pull: {users: req.params.user}};

  Place.update({_id: req.params.id}, update, function(err) {
    if(err) { return handleError(res, err); }
    return res.send(200);
  });
};

// Deletes a place from the DB.

exports.destroy = function(req, res) {
  Place.findById(req.params.id, function (err, place) {
    if(err) { return handleError(res, err); }
    if(!place) { return res.send(404); }
    place.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
