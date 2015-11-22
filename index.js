var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var expressValidator = require('express-validator');
var peopleRouter = require('./server/people');
var mongoose = require('mongoose');

mongoose.connect(
	'mongodb://' +
	(process.env.MONGO_URI || 'localhost') + ':' +
	(process.env.MONGO_PORT || 27017) + '/' +
	process.env.MONGO_DB, {
		db: {
			native_parser: true
		},
		server: {
			poolSize: 5
		},
		user: process.env.MONGO_USERNAME,
		pass: process.env.MONGO_PASSWORD
	});

app.use(express.static(process.env.NODE_ENV === 'production' ? 'dist' : 'public'));
app.use(expressValidator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use('/api/v1/people', peopleRouter);

var server = app.listen(process.env.PORT || 3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('App listening at http://%s:%s', host, port);
});