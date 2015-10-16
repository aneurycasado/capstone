app.directive("chooseMapModal", (MapFactory, MapElementFactory, StateFactory, $rootScope, $state) => {
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

				scope.loadUserMaps = () => {
					MapElementFactory.getMaps().then((maps) => {
						let jsonMaps = maps.map((map) => JSON.parse(map.map));
						$("#choseMapModal").modal("toggle");
						MapFactory.maps.length = 0;
						jsonMaps.forEach((map) => {
							MapFactory.createMap(map);
						})
						$("#choseMapModal").modal("toggle");
						//console.log("Maps", realMaps);
					});
				}

			 // }
		}
	}
});

