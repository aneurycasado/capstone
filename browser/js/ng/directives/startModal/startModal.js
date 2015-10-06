app.directive("startModal", function(MapFactory, $rootScope){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/startModal/startModal.html",
		link: function(scope){
			console.log("startModal maps", MapFactory.maps);
			scope.maps = MapFactory.maps
			$("#myModal").modal("show");
			scope.choseMap = function(num){
				$rootScope.$emit("mapChosen",num);
				console.log(num);
				$("#myModal").modal("toggle");
			}
		}
	}
})

