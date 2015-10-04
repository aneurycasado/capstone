app.factory('ViewFactory', function() {
	var stages = {};
	var newStage = function(name, color){
		stages[name] = new PIXI.Stage(color);
	};

	newStage('menu');
	newStage('play');
	// newStage('PE');
	// stages.play.addChild(stages.PE);

	return {
		stages,
		newStage
	};
});