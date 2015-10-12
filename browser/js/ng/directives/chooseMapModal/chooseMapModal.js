app.directive("chooseMapModal", (MapFactory, StateFactory, $rootScope) => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: (scope) => {
			scope.maps = MapFactory.maps
			if(StateFactory.mode !== "loadGame"){
				$("#choseMapModal").modal("toggle");
				scope.choseMap = (num) => {
					$rootScope.$emit("mapChosen",num);
					$("#choseMapModal").modal("toggle");
				}
			}
		}
	}
});

