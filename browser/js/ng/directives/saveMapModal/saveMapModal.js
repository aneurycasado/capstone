app.directive("saveMapModal", (MapFactory, MapElementFactory, StateFactory, $rootScope, $state) => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/saveMapModal/saveMapModal.html",
		link: (scope) => {		
			scope.goToMapCreatorMode = () => {
				$("#saveMapModal").modal("toggle");
				$state.go("mapCreatorMode");
			}
			scope.goToPlayState = () => {
				$("#saveMapModal").modal("toggle");
				$state.go('play');
			}
		}
	}
});