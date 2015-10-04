'use strict'
app.config(function ($stateProvider) {
    $stateProvider
        .state('play', {
            url: '/play',
            templateUrl: '/js/ng/states/play/play.state.html',
            controller: 'PlayController'
        })
});

app.controller('PlayController', function ($scope, $rootScope, GameFactory, TowerFactory, PlayerFactory) {
    console.log('play');
    GameFactory.init();
    $scope.tower = null;
    $scope.editing = false;
    $scope.setUp = true;
    $scope.playing = false;
    $rootScope.$on("currentTower", function (event, data) {
        $scope.tower = data;
    });
    $rootScope.$on("initiateWave", function (event, data) {
        $scope.setUp = false;
        $scope.playing = true;
        GameFactory.initiateWave();
        //$scope.$digest();
    });
    $('canvas').on('click', function (e) {
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / GameFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / GameFactory.cellSize);
            $scope.selectedTower = GameFactory.grid[towerPositionY][towerPositionX].contains.tower;
            if (GameFactory.grid[towerPositionY][towerPositionX].contains.tower) {
                $scope.editing = true;
                $scope.$digest();
            } else if (!GameFactory.grid[towerPositionY][towerPositionX].canPlaceTower) {
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

