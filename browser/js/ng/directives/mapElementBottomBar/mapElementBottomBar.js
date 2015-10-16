app.directive('mapElementBottomBar', () => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/mapElementBottomBar/mapElementBottomBar.html",
		controller: 'MapElementBottomBarController'
	}
});

app.controller('MapElementBottomBarController', ($scope, $rootScope, MapElementFactory) => {
	$scope.remove = (element) => {
		MapElementFactory.remove(element);
		$scope.mapElementClicked = null;
	}
});
