app.directive("uiPieces", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/uiPieces/uiPieces.html",
        controller: 'uiPiecesController'
    }
});

app.controller('uiPiecesController', function($scope){
	console.log("called");
});