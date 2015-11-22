var Person = require('./model');

/**
 * Create new person
 **/
exports.create = function(req, res) {
	var b = req.body;
	
	try {
		delete b.created_at;
	} catch (e) {}

	new Person(req.body).save(function(err, p) {
		if (err) {
			return res.status(400).json(err);
		}

		res.json(p);
	});
};