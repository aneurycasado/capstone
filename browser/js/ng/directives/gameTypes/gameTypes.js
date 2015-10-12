app.directive("gameTypes", () => {
	return {
		restrict: "E",
		templateUrl: '/js/ng/directives/gameTypes/gameTypes.html',
		controller: "GameTypesController"
	}
})

app.controller("GameTypesController", ($scope, $state) => {
	$scope.goToStoryMode = () => {
        $state.go("play", {"mode": "story"})
    }
    $scope.goToSurvivalMode = () => {
        $state.go("play", {"mode": "survival"})
    }
    $scope.goToDefault = () => {
        $state.go("play", {"mode": "default"})
    }
});