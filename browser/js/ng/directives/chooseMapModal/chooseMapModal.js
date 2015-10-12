app.directive("chooseMapModal", (MapFactory, $rootScope) => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: (scope) => {
			scope.maps = MapFactory.maps
			console.log(scope.player)
			if(scope.player !== "Guest"){
				scope.notAGuest = true;
			}else if(scope.player === "Guest"){
				scope.notAGuest = false;
			}
			$("#choseMapModal").modal("toggle");
			scope.choseMap = (num) => {
				$rootScope.$emit("mapChosen",num);
				$("#choseMapModal").modal("toggle");
			}
			scope.loadGame = () => {
				$rootScope.$emit("loadGame");
				$("#choseMapModal").modal("toggle");
			}
		}
	}
});

