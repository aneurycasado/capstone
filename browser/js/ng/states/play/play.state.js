'use strict';
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

app.controller('PlayController', function ($scope, player, $state,$timeout, $rootScope, WaveFactory, MapFactory, StateFactory, TowerFactory, PlayerFactory, EnemyFactory, ProjectileFactory, GameFactory) {
    let data = StateFactory;
    StateFactory.canvas = document.getElementById("stage");
    StateFactory.renderer = PIXI.autoDetectRenderer(data.width, data.height, data.canvas);
    document.body.appendChild(data.renderer.view);
    let start = map => {
        data.map = map;
        StateFactory.stages.play = new PIXI.Stage();
        StateFactory.stages.play.addChild(map.stage);//yaaaaa
        StateFactory.stages.play.addChild(EnemyFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(TowerFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(ProjectileFactory.stage);//yaaaaa
        data.state = "standby";
    };
    //Placed here for now
    let restart = (mapNum) => {
        ProjectileFactory.stage.removeChildren();
        TowerFactory.stage.removeChildren();
        EnemyFactory.stage.removeChildren();
        EnemyFactory.reset();
        StateFactory.stages.play.removeChildren(); 
        $rootScope.$emit('removeNextLevel');
        TowerFactory.resetTowers();
        PlayerFactory.restart();
        MapFactory.reset();
        WaveFactory.init();
        init(mapNum);
    }

    let init = (num) => {
        if(num !== undefined) $scope.mapNum = num;
        start(MapFactory.maps[$scope.mapNum]);
    };

    $rootScope.$on('mapChosen', (event,data) => {
        console.log("Map chosen ", data);
        init(data-1);
    });

    $rootScope.$on('choseADifferentMap', (event,data) => {
        restart(data-1);
    });
    $rootScope.$on("currentTower", (event, data) => {
        $scope.tower = data;
    });
    $rootScope.$on("initiateWave", (event, data) => {
        $scope.setUp = false;
        $scope.playing = true;
        data.initiateWave();
    });
    $rootScope.$on("readyForNextWave", (event, data) => {
        StateFactory.initiateWave();
    });
    $rootScope.$on('restartLevel', (event, data) => {
        restart();
    });
    $scope.tower = null;
    $('canvas').on('click', (e) => {
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / StateFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / StateFactory.cellSize);
            $scope.selectedTower = data.map.grid[towerPositionY][towerPositionX].contains.tower;

            if (data.map.grid[towerPositionY][towerPositionX].contains.tower) {
                $scope.editing = true;
                $scope.$digest();
            } else if (!data.map.grid[towerPositionY][towerPositionX].canPlaceTower) {

            } else {
                if(PlayerFactory.money - $scope.tower.price >= 0){
                    TowerFactory.createTower(towerPositionX, towerPositionY, $scope.tower.name + "Tower");
                    PlayerFactory.money -= $scope.tower.price;
                    $scope.$digest();
                }
            }
        }
    })
    GameFactory.loop(Date.now());
});

