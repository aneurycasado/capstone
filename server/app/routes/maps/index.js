var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var Map = mongoose.model("Map");

router.post('/', function(req,res){
	console.log("We hit the route in maps for sure");
	console.log(req.body);
	let map = {};
	map.map = JSON.stringify(req.body);
	Map.create(map).then((newMap) => {
		console.log("New map", newMap);
		res.json(newMap);
	})
	.then(null, function(error){
		console.log(error);
	});
});