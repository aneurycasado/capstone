'use strict'
app.config(function ($stateProvider) {
    $stateProvider
        .state('play', {
            url: '/play',
            templateUrl: '/js/ng/states/play/play.state.html',
            resolve: {
                player : function(PlayerFactory){
                    return PlayerFactory.getGame()
                }
            },
            controller: 'PlayController'
        })
});

app.controller('PlayController', function ($scope, player, $timeout, $rootScope, WaveFactory, MapFactory, StateFactory, TowerFactory, GridFactory, PlayerFactory, EnemyFactory, ProjectileFactory, GameFactory) {
    var data = StateFactory;
    console.log("Player from resolve ", player);
    var start = map => {
        data.map = map;
        GridFactory.grid = data.map.grid;
        StateFactory.stages.play = map.stage;
        data.state = "standby";
    };

    var init = () => {
        StateFactory.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
        StateFactory.waves.forEach(function(wave,i){
            WaveFactory.createWave(wave);
        });
        //WaveFactory.setCurrentWave();

        StateFactory.canvas = document.getElementById("stage");
        console.log(StateFactory.canvas);
        StateFactory.renderer = PIXI.autoDetectRenderer(data.width, data.height, data.canvas);
        document.body.appendChild(data.renderer.view);
        start(MapFactory.maps[0]);

    };

    init();

    $scope.tower = null;
    $scope.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
    $scope.count = 0;
    $rootScope.$on("currentTower", function (event, data) {
        $scope.tower = data;
    });
    $rootScope.$on("initiateWave", function (event, data) {
        $scope.setUp = false;
        $scope.playing = true;
        data.initiateWave();
    });
    $rootScope.$on("readyForNextWave", function (event, data) {
        console.log("We hit next wave");
        StateFactory.initiateWave();
        //$scope.$digest();
    });
    // window.addEventListener('mousedown', function (e) {
    $('canvas').on('click', function(e){
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / StateFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / StateFactory.cellSize);
            $scope.selectedTower = GridFactory.grid[towerPositionY][towerPositionX].contains.tower;
            console.log(GridFactory.grid[towerPositionY][towerPositionX].canPlaceTower);
            if (GridFactory.grid[towerPositionY][towerPositionX].contains.tower) {
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
    GameFactory.loop(Date.now());
});

