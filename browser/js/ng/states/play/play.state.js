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

app.controller('PlayController', function ($scope, player, $state,$timeout, $rootScope, WaveFactory, MapFactory, StateFactory, TowerFactory, PlayerFactory, EnemyFactory, ProjectileFactory, GameFactory) {
    var data = StateFactory;
    StateFactory.canvas = document.getElementById("stage");
    StateFactory.renderer = PIXI.autoDetectRenderer(data.width, data.height, data.canvas);
    document.body.appendChild(data.renderer.view);
    console.log("Player from resolve ", player);
    var start = map => {
        data.map = map;
        console.log("PROJ", ProjectileFactory.stage);
        console.log("STAGE", StateFactory.stages.play);
        StateFactory.stages.play = new PIXI.Stage();
        console.log("STAGE", StateFactory.stages.play)
        StateFactory.stages.play.addChild(map.stage);//yaaaaa
        StateFactory.stages.play.addChild(EnemyFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(TowerFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(ProjectileFactory.stage);//yaaaaa

        data.state = "standby";
    };

    var init = () => {

        start(MapFactory.maps[0]);
    };

    init();

    $scope.tower = null;
    //$scope.waves = [[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
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
    $rootScope.$on('restartLevel', function(event,data){
        ProjectileFactory.stage.removeChildren();
        TowerFactory.stage.removeChildren();
        EnemyFactory.stage.removeChildren();
        StateFactory.stages.play.removeChildren(); 

        $rootScope.$emit('removeNextLevel');
       
        TowerFactory.resetTowers();
        MapFactory.reset();
        WaveFactory.init();
        init();

    });
    // window.addEventListener('mousedown', function (e) {
    $('canvas').on('click', function(e){
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / StateFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / StateFactory.cellSize);
            $scope.selectedTower = data.map.grid[towerPositionY][towerPositionX].contains.tower;

            if (data.map.grid[towerPositionY][towerPositionX].contains.tower) {
                $scope.editing = true;
                $scope.$digest();
            } else if (!data.map.grid[towerPositionY][towerPositionX].canPlaceTower) {

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

