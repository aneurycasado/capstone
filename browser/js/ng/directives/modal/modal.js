app.directive("modal", function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/modal/modal.html",
		link: function(scope){
			$("#myModal").modal("show");
		}
	}
})

