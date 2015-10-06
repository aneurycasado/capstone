app.directive("chooseMapModal", function(MapFactory, $rootScope){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: function(scope){
			console.log("startModal maps", MapFactory.maps);
			scope.maps = MapFactory.maps
			$("#choseMapModal").modal("toggle");
			scope.choseMap = function(num){
				$rootScope.$emit("mapChosen",num);
				console.log(num);
				$("#choseMapModal").modal("toggle");
			}
		}
	}
})

