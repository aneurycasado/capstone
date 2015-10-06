app.directive("chooseMapModal", function(MapFactory, $rootScope){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/chooseMapModal/chooseMapModal.html",
		link: function(scope){
			scope.maps = MapFactory.maps
			$("#choseMapModal").modal("toggle");
			scope.choseMap = (num) => {
				$rootScope.$emit("mapChosen",num);
				$("#choseMapModal").modal("toggle");
			}
		}
	}
})

