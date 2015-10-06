app.directive("levelModal", function($rootScope){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/levelModal/levelModal.html",
        link: function(scope){
            $rootScope.$on('wavesDone', function() {
                console.log("WAVES DONE LINK");
                $("#levelModal").modal("show");
                scope.$digest();
                scope.initiateLevel = function() {
                    $("#levelModal").modal("toggle");
                    $rootScope.$emit('sentToNextLevel');
                }
                scope.restartLevel = function(){
                    $rootScope.$emit('restartLevel');
                }
                scope.choseDifferentMap = function(){
                    $rootScope.$emit('choseDifferentMap');
                }
            })
        }
    }
});

