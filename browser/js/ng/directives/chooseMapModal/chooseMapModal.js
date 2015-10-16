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
						let realMaps = maps.map((map) => {
							let objectMap = JSON.parse(map.map);
							let realMap = [];
							for(let key in objectMap){
								realMap.push(objectMap[key])
							}
							return realMap;
						}); 
						//console.log("Maps", realMaps);
					});
				}

			 // }
		}
	}
});

