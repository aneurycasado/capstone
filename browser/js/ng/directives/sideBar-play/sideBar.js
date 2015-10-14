app.directive("sideBarPlay", () => {
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar-play/sideBar.html",
        controller: 'SideBarPlayController'
    }
});

app.controller('SideBarPlayController', ($scope, $rootScope, PlayerFactory, GameFactory, StateFactory, WaveFactory, EnemyFactory, TowerFactory) => {
    $(document).ready(() => {
        $('.toolTipSideBar').tooltip();
    });
    const towersToBuy = [
            {name: "Ice", price: 50, effect: "Fill in", imgUrl: "./images/tower-defense-turrets/turret-4-1.png"}, 
            {name: "Thunder", price: 50, effect: "Fill in", imgUrl: "./images/tower-defense-turrets/turret-5-1.png"}, 
            {name: "Poison", price: 50, effect: "Fill in", imgUrl: "./images/tower-defense-turrets/turret-6-1.png"},
            {name: "Fire", price: 50, effect: "Fill in", imgUrl: "./images/tower-defense-turrets/turret-7-1.png"}
    ]
    $scope.playerStats = PlayerFactory;
    $scope.waves = WaveFactory.waves;
    $scope.currentWave = 0; 
    $scope.totalEnemiesKilled = 0;
    $scope.totalEnemies = 0;
    $scope.enemiesKilled = EnemyFactory.terminatedEnemies.length;
    $scope.state = StateFactory.state;
    $scope.constructors = TowerFactory.towers;
    $scope.towers = towersToBuy;
    $rootScope.$on('wavesDone', () => {
        $scope.totalEnemiesKilled+= EnemyFactory.terminatedEnemies.length;
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
    $rootScope.$on('restartLevel', () => {
        $scope.currentWave = 0;
        $scope.totalEnemiesKilled = 0; 
        $scope.totalEnemies = 0;
        $scope.enemiesKilled = 0;
    });
    //Not working
    // $rootScope.$on('loadGameSideBar', () => {
    //     console.log("We are updating load game");
    //     $scope.currentWave = $scope.player.game.currentWave;
    //     $scope.totalEnemiesKilled = $scope.player.game.totalEnemiesKilled;
    //     $scope.waves = WaveFactory.waves;
    //     $scope.state = StateFactory.state;
    // });
    // $scope.saveGame = () => {
    //     let player = {
    //         health: PlayerFactory.health,
    //         money: PlayerFactory.money,
    //         currentWave: $scope.currentWave,
    //         totalEnemiesKilled: $scope.totalEnemiesKilled,
    //         mapNum: $scope.mapNum,
    //         towers: TowerFactory.savedTowers,
    //         mode: StateFactory.mode,
    //     };
    //     PlayerFactory.saveGame(player).then((savedInfo) => {
    //         console.log("Saved Info ", savedInfo);
    //     });
    // }
    $scope.towerClicked = (tower) => {
        $rootScope.$emit("currentTower", tower);
    }
    $scope.initiateWave = () => {
        $scope.currentWave++;
        GameFactory.changeStateTo("wave");
        $scope.state = StateFactory.state;
        EnemyFactory.terminatedEnemies.length = 0;
        $scope.totalEnemies = WaveFactory.currentWaveLength();
        $scope.enemiesKilled = EnemyFactory.terminatedEnemies.length;
    }
});




