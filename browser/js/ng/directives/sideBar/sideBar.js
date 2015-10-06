app.directive("sideBar", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar/sideBar.html",
        controller: 'SideBarController'
    }
});

app.controller('SideBarController', function($scope, $rootScope, PlayerFactory, GameFactory, StateFactory, WaveFactory, EnemyFactory) {
    $scope.player = PlayerFactory;
    $scope.waves = WaveFactory.waves;
    $scope.enemies = EnemyFactory.enemies;
    $scope.showTowers = true;
    $scope.firstWave = true;
    $scope.showPowerUps = false;
    $scope.towers = createTowers();
    $scope.nextWave = false;
    $scope.nextLevel = false;
    $scope.count = 0;
    $scope.state = StateFactory.state;
    $rootScope.$on('wavesDone', () => {
        $scope.state = 'complete';
        $scope.$digest();
    })
    $rootScope.$on("nextWave", () => {
        $scope.state = 'standby';
        $scope.$digest();
    });
    $rootScope.$on('removeNextLevel', () => {
        $scope.state = 'standby';
    });
    $rootScope.$on('mapChosen', () => {
        $scope.state = 'standby';
        console.log("Map chosen");
    });

    $scope.saveGame = () => {
        let player = {
            health: PlayerFactory.health,
            money: PlayerFactory.money
        }
        PlayerFactory.saveGame(player).then((savedInfo) => {
            console.log("Saved Info ", savedInfo);
        });
    }
    $scope.changeStore = (tab) => {
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
    $scope.towerClicked = (tower) => {
        $rootScope.$emit("currentTower", tower);
    }
    $scope.initiateWave = () => {
        GameFactory.changeStateTo("wave");
        $scope.state = StateFactory.state;
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


