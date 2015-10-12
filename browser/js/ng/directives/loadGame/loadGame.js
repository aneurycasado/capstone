app.directive("loadGame", () => {
	return{
		restrict: "E",
		templateUrl: '/js/ng/directives/loadGame/loadGame.html',
		controller: "LoadGameController"
	}
})

app.controller("LoadGameController", ($scope, $state) => {
	$scope.newGame = () => {
		$scope.pickGameType = true;
		console.log("New Game");
	}
	$scope.loadGame = () => {
		$state.go("play", {"mode": "savedGame"});
		console.log("Load Game");
	}
	$scope.makeAMap = () => {
		$state.go("mapCreatorMode");
		console.log("Make a Map");
	}
	$scope.testMaps = () => {
		// $state.go("testMapMode");
		console.log("Test Map");
	}
});