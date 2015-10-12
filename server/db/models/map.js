let mongoose = require('mongoose');

let schema = new mongoose.Schema({
	map: String
});

mongoose.model('Map', schema);