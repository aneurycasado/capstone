app.directive('startScreen', () =>{
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/startScreen/startScreen.html",
		controller: 'StartScreenController'
	}
});

app.controller('StartScreenController', ($scope,$state) => {
	$scope.goToChoose = () => $state.go("choose");
});
