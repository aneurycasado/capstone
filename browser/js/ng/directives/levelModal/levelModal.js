app.directive("levelModal", function($rootScope){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/startModal/startModal.html",
        link: function(scope){
            $rootScope.$on('wavesDone', function() {
                $("#levelModal").modal("show");
                scope.$digest();
                scope.initiateLevel = function() {
                    $("#levelModal").modal("toggle");
                    $rootScope.$emit('sentToNextLevel');
                }
            })
        }
    }
})

