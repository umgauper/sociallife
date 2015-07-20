'use strict';

/*https://arian.io/how-to-use-yelps-api-with-node/ */

var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var request = require('request');
var qs = require('querystring');
var _ = require('lodash');
var Data = require('./data.model');
var config = require('../../config/environment');

// Send search request via Yelp's search API

exports.showBars = function(req, res) {
  request_yelp({location: req.params.location}, function(error, response, body) {
      return res.send(body);
  });
};

var request_yelp = function(set_parameters, callback) {

  var httpMethod = 'GET';

  var url = 'http://api.yelp.com/v2/search';

  var default_parameters = {
    location: 'Sacramento',
    term: 'bars',
    sort: '0'
  };

  var required_parameters = {
    oauth_consumer_key: config.yelp.consumer_key,
    oauth_token: config.yelp.token,
    oauth_nonce: n(),
    oauth_timestamp: n().toString().substr(0, 10),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0'
  };

  var parameters = _.assign(default_parameters, set_parameters, required_parameters);

  //put these in config/index.js b4 pushing to Git
  var consumerSecret = config.yelp.consumer_secret;/*process.env.consumerSecret || '3NM7aalnzr3f3bsnMDbZktWcuSE';*/
  var tokenSecret = config.yelp.token_secret;/*process.env.tokenSecret || 'jh3itQWL0PVbT_5pYYkHa2x2aQY';*/

  var signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret,
  tokenSecret, {encodeSignature: false});

  parameters.oauth_signature = signature;

  var paramURL = qs.stringify(parameters);

  var apiURL = url + '?' + paramURL;
  request(apiURL, function(error, response, body) {
    return callback(error, response, body);
  });

};

//TODO: put request_yelp into its own module

function handleError(res, err) {
  return res.send(500, err);
}
