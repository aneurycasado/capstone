let mongoose = require('mongoose');

let schema = new mongoose.Schema({
	map: {
		type: String
	}
});

mongoose.model('Map', schema);