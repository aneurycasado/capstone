app.directive("levelModal", function($rootScope){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/levelModal/levelModal.html",
        link: function(scope){
            $rootScope.$on('wavesDone', () => {
                $("#levelModal").modal("show");
                scope.$digest();
                scope.initiateLevel = () => {
                    $("#levelModal").modal("toggle");
                    $rootScope.$emit('sentToNextLevel');
                }
                scope.restartLevel = () => {
                    $rootScope.$emit('restartLevel');
                }
                scope.choseDifferentMap = () => {
                    $("#levelModal").modal("toggle");
                    $("#choseMapModal").modal("toggle");
                }
                scope.choseMap = (num) => {
                    $("#choseMapModal").modal("toggle");
                    $rootScope.$emit("choseADifferentMap",num);
                }
            })
        }
    }
});

