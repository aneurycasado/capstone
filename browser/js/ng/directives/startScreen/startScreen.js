app.directive('startScreen', function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/startScreen/startScreen.html",
		controller: 'StartScreenController'
	}
});

app.controller('StartScreenController', function($scope,$state){
	$scope.goToChoose = () => $state.go("choose");
});
