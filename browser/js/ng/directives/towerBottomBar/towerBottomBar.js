app.directive('towerBottomBar', function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/towerBottomBar/towerBottomBar.html",
		controller: 'TowerBottomBarController'
	}
});

app.controller('TowerBottomBarController', function($scope,$rootScope,$state){

	$rootScope.$on("currentTower", function(event,data){
		console.log("Current Tower in TowerBottomBarController", data);
		$scope.tower = data;
	})

	$scope.sellTower = function(tower){
		console.log("The tower being sold ", tower);
		console.log("Sell Tower");
	}
	console.log("Cool");
});
