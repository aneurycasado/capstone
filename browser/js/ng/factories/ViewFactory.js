app.factory('ViewFactory', function() {
	var stages = {};
	var newStage = function(name, color){
		stages[name] = new PIXI.Stage(color);
	};
	return {
		stages,
		newStage
	};
});