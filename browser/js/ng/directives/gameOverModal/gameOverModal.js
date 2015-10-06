app.directive("gameOverModal", function($rootScope){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/gameOverModal/gameOverModal.html",
        link: function(scope){
            $rootScope.$on('gameOver', () => {
                $("#gameOverModal").modal("toggle");
                scope.$digest();
                scope.restartLevel = () => {
                    $rootScope.$emit('restartLevel');
                }
                scope.choseDifferentMap = () => {
                    $("#gameOverModal").modal("toggle");
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