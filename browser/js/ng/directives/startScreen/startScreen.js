app.directive('startScreen', function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/startScreen/startScreen.html",
		controller: 'StartScreenController'
	}
});

app.controller('StartScreenController', function($scope,$state){
	$scope.goToLoadState = () => $state.go("play");
});
