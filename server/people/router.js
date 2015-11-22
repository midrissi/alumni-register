var express = require('express');
var router = express.Router();
var ctrl = require('./controller');

router
	.route('/')
	// Create new person
	.post(ctrl.create);

module.exports = router;