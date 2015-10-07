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
        let bg = new PIXI.Sprite(PIXI.Texture.fromImage("/images/bg.png"));
        bg.width = data.width;
        bg.height = data.height;
        StateFactory.stages.play.addChild(bg);//yaaaas
        StateFactory.stages.play.addChild(map.stage);//yaaaaa
        StateFactory.stages.play.addChild(EnemyFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(TowerFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(ProjectileFactory.stage);//yaaaas

        data.state = "standby";
    };
    //Placed here for now
    let restart = (mapNum) => {
        ProjectileFactory.stage.removeChildren();
        TowerFactory.stage.removeChildren();
        EnemyFactory.stage.removeChildren();
        EnemyFactory.enemies = [];
        StateFactory.stages.play.removeChildren(); 
        EnemyFactory.reset();
        StateFactory.stages.play.removeChildren();
        $rootScope.$emit('removeNextLevel');
        TowerFactory.resetTowers();
        EnemyFactory.reset();
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
            let selectedGrid = data.map.grid[towerPositionY][towerPositionX];
            $scope.selectedTower = selectedGrid.contains.tower;

            if (selectedGrid.contains.tower) {
                $scope.editing = true;
                $scope.$digest();
            } else if (typeof data.map.grid[towerPositionY][towerPositionX] == "string") {
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

