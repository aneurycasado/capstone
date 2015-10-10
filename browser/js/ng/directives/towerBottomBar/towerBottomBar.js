app.directive('towerBottomBar', function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/towerBottomBar/towerBottomBar.html",
		controller: 'TowerBottomBarController'
	}
});

app.controller('TowerBottomBarController', function($scope,$rootScope,$state, TowerFactory, PlayerFactory){
	$rootScope.$on("setEditing",function(event,data){
		if(data === false){
			$scope.selectedTower = null;
		}
	})
	$scope.sellTower = function(tower){
		$scope.selectedTower = null;
		console.log("The tower being sold ", tower);
		console.log("Sell Tower");
		TowerFactory.removeTower(tower);
		PlayerFactory.money += (tower.price *.7);
	}
});
