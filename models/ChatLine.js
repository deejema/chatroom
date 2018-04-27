var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Collection adn schema for items
var ChatLine = new Schema({
	username: { type: String},
	content: { type: String }
	},{
		collection: 'chat'
});

module.exports = mongoose.model('ChatLine',ChatLine);