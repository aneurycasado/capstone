app.directive("chooseMapModal", (MapFactory, StateFactory, $rootScope, $state) => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: (scope) => {
			scope.maps = MapFactory.maps
			// if(scope.player.game.currentWave === "undefined"){
				$("#choseMapModal").modal("toggle");
				scope.choseMap = (num) => {
					$rootScope.$emit("mapChosen",num);
					$("#choseMapModal").modal("toggle");
				}
				scope.goToMapCreatorMode = () => {
					$("#choseMapModal").modal("toggle");
					$state.go("mapCreatorMode");
				}
			 // }
		}
	}
});

