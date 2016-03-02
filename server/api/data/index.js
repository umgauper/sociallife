'use strict';

var express = require('express');
var controller = require('./data.controller');

var router = express.Router();

router.get('/:location', controller.showBars);

module.exports = router;
