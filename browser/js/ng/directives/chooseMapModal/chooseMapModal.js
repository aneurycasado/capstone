app.directive("chooseMapModal", (MapFactory, StateFactory, $rootScope) => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: (scope) => {
			scope.maps = MapFactory.maps
			console.log("Mode in chooseMap modal",StateFactory.mode)
			// if(scope.player.game.currentWave === "undefined"){
				$("#choseMapModal").modal("toggle");
				scope.choseMap = (num) => {
					$rootScope.$emit("mapChosen",num);
					$("#choseMapModal").modal("toggle");
				}
			 // }
		}
	}
});

