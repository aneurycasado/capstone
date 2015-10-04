'use strict'
app.config(function ($stateProvider) {
    $stateProvider
        .state('play', {
            url: '/play',
            templateUrl: '/js/ng/states/play/play.state.html',
            controller: 'PlayController'
        })
});

app.controller('PlayController', function ($scope, $timeout, $rootScope, GameFactory, TowerFactory, GridFactory, PlayerFactory) {

    console.log('play');
    GameFactory.init();
    $scope.tower = null;
    $scope.editing = false;
    $scope.setUp = true;
    $scope.playing = false;
    $scope.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
    $rootScope.$on("currentTower", function (event, data) {
        $scope.tower = data;
    });
    $rootScope.$on("initiateWave", function (event, data) {
        console.log($scope.waves);
        $scope.setUp = false;
        $scope.playing = true;
        GameFactory.createWave($scope.waves[0]);
        $scope.waves.splice(0, 1);
        GameFactory.initiateWave();
        //$scope.$digest();
    });

    //$rootScope.$on('launchNext', function(event, data) {
    //    console.log($scope.waves.length);
    //    if($scope.waves.length === 0 ) return;
    //    $timeout(function(){
    //            console.log($scope.waves);
    //            GameFactory.createWave($scope.waves[0]);
    //            $scope.waves.splice(0, 1);
    //        },
    //        20000);
    //}) //FIXME

    $('canvas').on('click', function (e) {
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / GameFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / GameFactory.cellSize);
            $scope.selectedTower = GridFactory.grid[towerPositionY][towerPositionX].contains.tower;
            console.log(GridFactory.grid[towerPositionY][towerPositionX].canPlaceTower);
            if (GridFactory.grid[towerPositionY][towerPositionX].contains.tower) {
                console.log("editing = true");
                $scope.editing = true;
                $scope.$digest();
            } else if (!GridFactory.grid[towerPositionY][towerPositionX].canPlaceTower) {
                console.log("false");
            } else {
                if(PlayerFactory.money - TowerFactory.prices[$scope.tower.type] >= 0){
                    TowerFactory.createTower(towerPositionX, towerPositionY, $scope.tower.type + "Tower");
                    PlayerFactory.money -= TowerFactory.prices[$scope.tower.type];
                    $scope.$digest();
                }
            }
        }
    })
});

