var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

var schema = new Schema({
	title: {
		type: String,
		validate: {
			validator: function(v) {
				return ['M.', 'Mme.', 'Mlle.'].indexOf(v) >= 0;
			},
			message: "{VALUE} n'est pas un titre valide."
		}
	},
	name: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		max: 2016,
		min: 1979
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	modified_at: {
		type: Date,
		default: Date.now
	},
	email: {
		type: String,
		required: true,
		validate: {
			validator: function(v) {
				return mailRegex.test(v);
			},
			message: "'{VALUE}' n'est pas un email valide."
		}
	},
	phone: String,
	country: String,
	address: String,
	unemployed: {
		type: Boolean,
		default: false
	},
	company: {
		activity: String,
		address: String,
		city: String,
		name: String,
		role: String,
		size: String,
		_type: String
	},
	activities: [{
		organism: String,
		project: String,
		realizations: String
	}],
	experience: [{
		company: String,
		date: {
			startDate: Date,
			endDate: Date
		},
		role: String,
		description: String
	}]
});

schema.pre('save', function(next) {
	if (!this.created_at || this.isNew) this.created_at = new Date;

	this.modified_at = new Date;
	
	next();
})

module.exports = mongoose.model('Person', schema);