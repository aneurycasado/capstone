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
    $scope.towers = createTowers();
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

});

function createTowers (){
    var array = [];
    var Ice = {
        type: "Ice",
        img: "./images/tower-defense-turrets/turret-4-1.png",
        effect: "effect",
    };
    var Fire = {
        type: "Fire",
        img: "./images/tower-defense-turrets/turret-5-1.png",
        effect: "effect",
    };
    var Thunder = {
        type: "Thunder",
        img: "./images/tower-defense-turrets/turret-6-1.png",
        effect: "effect",
    };
    var Poison = {
        type: "Poison",
        img: "./images/tower-defense-turrets/turret-7-1.png",
        effect: "effect",
    };
    array.push(Ice);
    array.push(Fire);
    array.push(Thunder);
    array.push(Poison);
    console.log(array);
    return array;
}


