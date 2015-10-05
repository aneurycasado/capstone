app.directive("sideBar", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar/sideBar.html",
        controller: 'SideBarController'
    }
});

app.controller('SideBarController', function($scope, $rootScope, PlayerFactory, GameFactory, StateFactory) {
    $scope.player = PlayerFactory;
    $scope.showTowers = true;
    $scope.firstWave = true;
    $scope.showPowerUps = false;
    $scope.towers = createTowers();
    $scope.nextWave = false;
    $scope.nextLevel = false;
    $scope.count = 0;
    $scope.state = StateFactory.state;

    $rootScope.$on('wavesDone', function() {
        console.log('in the wavesDone');
        $scope.state = 'complete';
        $scope.$digest();
    })
    $rootScope.$on("nextWave", function(){
        console.log("Time to trigger nextWave");
        $scope.state = 'standby';
        $scope.$digest();
    });
    $scope.saveGame = function(){
        var player = {
            health: PlayerFactory.health,
            money: PlayerFactory.money
        }
        PlayerFactory.saveGame(player).then(function(savedInfo){
            console.log("Saved Info ", savedInfo);
        });
    }
    $scope.changeStore = function(tab) {
        if(tab === "tower"){
            $scope.showTowers = true;
            $scope.showPowerUps = false;
        }else if(tab === "powerUp") {
            $scope.showTowers = false;
            $scope.showPowerUps = true;
        }else if(tab === "all") {
            $scope.showTowers = true;
            $scope.showPowerUps = true;
        }
    }
    $scope.towerClicked = function(tower){
        console.log("tower clicked ", tower);
        $rootScope.$emit("currentTower", tower);
    }
    $scope.initiateWave = function(){
        //console.log("initiateWave");
        GameFactory.changeStateTo("wave");
        console.log($scope.state);
        $scope.state = StateFactory.state;
    }
    //$scope.initiateNextWave = function(){
    //    console.log("triggerNextWave");
    //    $scope.nextWave = false;
    //    GameFactory.changeStateTo("wave");
    //}
    $scope.initiateLevel = function() {
        GameFactory.changeStateTo("selection");
    }
});

function createTowers (){
    var array = [];
    var Ice = {
        type: "Ice",
        img: "./images/tower-defense-turrets/turret-4-1.png",
        effect: "effect",
        price: 50,
    };
    var Fire = {
        type: "Fire",
        img: "./images/tower-defense-turrets/turret-7-1.png",
        effect: "effect",
        price: 50,
    };
    var Thunder = {
        type: "Thunder",
        img: "./images/tower-defense-turrets/turret-5-1.png",
        effect: "effect",
        price: 50,
    };
    var Poison = {
        type: "Poison",
        img: "./images/tower-defense-turrets/turret-6-1.png",
        effect: "effect",
        price: 50,
    };
    array.push(Ice);
    array.push(Fire);
    array.push(Thunder);
    array.push(Poison);
    return array;
}


