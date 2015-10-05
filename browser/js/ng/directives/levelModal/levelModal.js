app.directive("levelModal", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/startModal/startModal.html",
        link: function(scope){
            scope.initiateNextLevel = () => {
            }
            //$("#myModal").modal("show");
        }
    }
})

