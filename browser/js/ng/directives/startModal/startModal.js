app.directive("startModal", function(){
	return {
		restrict: "E",
		templateUrl: "js/ng/directives/startModal/startModal.html",
		link: function(scope){
			$("#myModal").modal("show");
		}
	}
})

