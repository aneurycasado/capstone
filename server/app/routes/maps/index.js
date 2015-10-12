var router = require('express').Router();
var mongoose = require('mongoose');
module.exports = router;
var Map = mongoose.model("Map");

router.post('/', function(req,res){
	console.log("We hit the route in maps");
	Map.create(req.body).then((newMap) => {
		res.json(newMap);
	});
});