app.directive('mapElementBottomBar', () => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/mapElementBottomBar/mapElementBottomBar.html",
		controller: 'MapElementBottomBarController'
	}
});

app.controller('MapElementBottomBarController', ($scope,$rootScope,$state, TowerFactory, PlayerFactory, GameFactory, StateFactory) => {
	$scope.remove = (element) => {
		$scope.selectedTower = null;
		console.log("The tower being sold ", tower);
		console.log("Sell Tower");
		TowerFactory.removeTower(tower);
	}
});
