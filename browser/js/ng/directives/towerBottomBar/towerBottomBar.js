app.directive('towerBottomBar', function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/towerBottomBar/towerBottomBar.html",
		controller: 'TowerBottomBarController'
	}
});

app.controller('TowerBottomBarController', function($scope,$rootScope,$state){
	$rootScope.$on("setEditing",function(event,data){
		if(data === false){
			$scope.selectedTower = null;
		}
	});
	$scope.sellTower = function(tower){
		console.log("The tower being sold ", tower);
		console.log("Sell Tower");
	}
	
});
