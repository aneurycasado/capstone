app.directive("sideBar", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar/sideBar.html",
        controller: 'SideBarController'
    }
});

app.controller('SideBarController', function($scope, PlayerFactory) {
    $scope.player = PlayerFactory
    $scope.showTowers = true;
    $scope.showPowerUps = false;
    $scope.changeStore = function(tab){
        if(tab === "tower"){
            $scope.showTowers = true;
            $scope.showPowerUps = false;
        }else if(tab === "powerUp"){
            $scope.showTowers = false;
            $scope.showPowerUps = true;
        }else if(tab === "all"){
            $scope.showTowers = true;
            $scope.showPowerUps = true;
        }
    }

})
