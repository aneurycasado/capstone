'use strict'
app.config(function ($stateProvider) {
    $stateProvider
        .state('play', {
            url: '/play',
            templateUrl: '/js/ng/states/play/play.state.html',
            controller: 'PlayController'
        })
});

app.controller('PlayController', function ($scope, $timeout, $rootScope, GameFactory, TowerFactory, GridFactory, PlayerFactory, ViewFactory) {
    GameFactory.init();
    $scope.tower = null;
    $scope.editing = false;
    $scope.setUp = true;
    $scope.playing = false;
    $scope.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
    $scope.count = 0;
    $rootScope.$on("currentTower", function (event, data) {
        $scope.tower = data;
    });
    $rootScope.$on("initiateWave", function (event, data) {
        $scope.setUp = false;
        $scope.playing = true;
        GameFactory.initiateWave();
        //$scope.$digest();
    });
    $rootScope.$on("readyForNextWave", function (event, data) {
        console.log("We hit next wave");
        GameFactory.initiateWave();
        //$scope.$digest();
    });
    $scope.update = then => {
        var now = Date.now();
        var delta = (now - then)/1000;
        if (GameFactory.state === "menu"){
        }
        else if (GameFactory.state === "play") {
            if(GameFactory.nextWave){
                GameFactory.nextWave = false;
                $rootScope.$emit("nextWave")
                $scope.count++;
            }
            GameFactory.update(delta);
            
        }
        GameFactory.renderer.render(ViewFactory.stages[GameFactory.state]);
        requestAnimationFrame($scope.update.bind(null, now));
    };

    //$rootScope.$on('launchNext', function(event, data) {
    //    console.log($scope.waves.length);
    //    if($scope.waves.length === 0 ) return;
    //    $timeout(function(){
    //            console.log($scope.waves);
    //            GameFactory.createWave($scope.waves.splice(0, 1)[0]);
    //
    //        },
    //        5000);
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
    $scope.update(Date.now());
});

