app.directive('towerBottomBar', () => {
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/towerBottomBar/towerBottomBar.html",
		controller: 'TowerBottomBarController'
	}
});

app.controller('TowerBottomBarController', ($scope,$rootScope,$state, TowerFactory, PlayerFactory) => {
	$rootScope.$on("setEditing",(event,data) => {
		if(data === false){
			$scope.selectedTower = null;
		}
	})
	$scope.sellTower = (tower) => {
		$scope.selectedTower = null;
		console.log("The tower being sold ", tower);
		console.log("Sell Tower");
		TowerFactory.removeTower(tower);
		PlayerFactory.money += (tower.price *.7);
	}
});
