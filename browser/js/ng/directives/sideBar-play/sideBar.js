app.directive("sideBarPlay", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar-play/sideBar.html",
        controller: 'SideBarPlayController'
    }
});

app.controller('SideBarPlayController', function($scope, $rootScope, PlayerFactory, GameFactory, StateFactory, WaveFactory, EnemyFactory, TowerFactory) {
    $scope.player = PlayerFactory;
    if(StateFactory.mode === "survival"){
        $scope.survival = true;
    }
    $scope.waves = WaveFactory.waves;
    $scope.currentWave = 0;
    $scope.totalEnemiesKilled = 0;
    $scope.totalEnemies = 0;
    $scope.enemiesKilled = EnemyFactory.terminatedEnemies.length;
    $scope.showTowers = true;
    $scope.firstWave = true;
    $scope.showPowerUps = false;
    $scope.nextWave = false;
    $scope.nextLevel = false;
    $scope.count = 0;
    $scope.state = StateFactory.state;
    $scope.constructors = TowerFactory.towers;
    $scope.towers = [];
    for(let key in TowerFactory.towers){
        let currentTower = new TowerFactory.towers[key](0,0);
        var img = currentTower.imgNum;
        currentTower.imgUrl = "./images/tower-defense-turrets/turret-" + img + "-1.png";
        $scope.towers.push(currentTower);
        currentTower.terminate();
    }
    $rootScope.$on('wavesDone', () => {
        $scope.state = 'complete';
        $scope.$digest();
    });
    $rootScope.$on('updateNumberOfEnemies', () => {
        $scope.enemiesKilled = EnemyFactory.terminatedEnemies.length;
        $scope.$digest();
    });
    $rootScope.$on("nextWave", () => {
        $scope.state = 'standby';
        $scope.$digest();
    });
    $rootScope.$on('removeNextLevel', () => {
        $scope.state = 'standby';
    });
    $rootScope.$on('mapChosen', () => {
        $scope.state = 'standby';
    });
    $scope.saveGame = () => {
        let player = {
            health: PlayerFactory.health,
            money: PlayerFactory.money,
            currentWave: $scope.currentWave,
            totalEnemiesKilled: $scope.totalEnemiesKilled
        };
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
        $scope.currentWave++;
        $scope.totalEnemiesKilled+= EnemyFactory.terminatedEnemies.length;
        GameFactory.changeStateTo("wave");
        EnemyFactory.resetTerminatedEnemies();
        $scope.state = StateFactory.state;
        $scope.totalEnemies = WaveFactory.currentWaveLength();
    }
    $scope.showStats = () => {
        $("#playerStatisticsModal").modal("toggle");
    }
    // $scope.initiateLevel = () => {
    //     console.log("Next LEvel");
    // }

});

function createTowers (){
    return array;
}
