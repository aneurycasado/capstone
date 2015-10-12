'use strict';
app.config(($stateProvider) => {
    $stateProvider
        .state('play', {
            url: '/play/:mode',
            templateUrl: '/js/ng/states/play/play.state.html',
            resolve: {
                player: (PlayerFactory) => {
                    return PlayerFactory.getGame();
                },
                mode: ($stateParams, StateFactory) => {
                    if($stateParams.mode === "savedGame"){
                        StateFactory.loadGame = true; 
                    }
                    StateFactory.mode = $stateParams.mode;
                }
            },
            controller: 'PlayController'
        });
});

app.controller("PlayController", function ($scope, player, $state, $timeout, $rootScope, ParticleFactory, WaveFactory, MapFactory, StateFactory, TowerFactory, PlayerFactory, EnemyFactory, SpriteEventFactory, ProjectileFactory, GameFactory) {
    $scope.mode = StateFactory.mode;
    $scope.player = player;
    if($scope.player.game.mode){
        StateFactory.mode = $scope.player.game.mode;
        WaveFactory.init();
    }
    StateFactory.canvas = document.getElementById("stage");
    StateFactory.renderer = PIXI.autoDetectRenderer(StateFactory.width, StateFactory.height, StateFactory.canvas);
    $("#mainContainer").append(StateFactory.renderer.view);
    $(StateFactory.renderer.view).attr("id","pixiCanvas");
    const init = (num, state) => {
        if (num !== undefined) $scope.mapNum = num;
        start(MapFactory.maps[$scope.mapNum], "newGame");
    };
    const loadGame = () => {
        $scope.mapNum = $scope.player.game.mapNum;
        PlayerFactory.health = $scope.player.game.health;
        PlayerFactory.money = $scope.player.game.money;
        start(MapFactory.maps[$scope.player.game.mapNum]);
        WaveFactory.loadWaves($scope.player.game.currentWave);
        $rootScope.$emit("loadGameSideBar")
        start(MapFactory.maps[$scope.player.game.mapNum] ,"loadGame");
    };
    const restart = (mapNum) => {
        let mode = StateFactory.mode;
        ProjectileFactory.stage.removeChildren();
        TowerFactory.stage.removeChildren();
        EnemyFactory.restart();
        StateFactory.stages.play.removeChildren();
        $rootScope.$emit('removeNextLevel');
        TowerFactory.resetTowers();
        PlayerFactory.restart();
        MapFactory.reset();
        WaveFactory.init(mode);
        $rootScope.$emit('resetSideBar');
        init(mapNum);
    } 
    const start = (map, gameType) => {
        StateFactory.map = map;
        StateFactory.stages.play = new PIXI.Stage();
        let bg = new PIXI.Sprite(PIXI.Texture.fromImage("/images/bg.png"));
        bg.interactive = true;
        bg.click = SpriteEventFactory.bgClickHandler;
        bg.width = StateFactory.width;
        bg.height = StateFactory.height;
        StateFactory.stages.play.addChild(bg);//yaaaas
        StateFactory.stages.play.addChild(map.stage);//yaaaaa
        StateFactory.stages.play.addChild(TowerFactory.stage);//yaaaaa
        // StateFactory.stages.play.addChild(EnemyFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(EnemyFactory.stage);//yaaaaa
        StateFactory.stages.play.addChild(ProjectileFactory.stage);//yaaaas
        if(gameType === "loadGame"){
            $scope.player.game.towers.forEach(function(tower){
                TowerFactory.createTower(tower.x,tower.y,tower.name);
            });
        }
        // StateFactory.stages.play.addChild(ParticleFactory.stage);//yaaaas
        StateFactory.state = "standby";
    };
    $rootScope.$on('mapChosen', (event, mapNum) => {
        init(mapNum);
    });
    $rootScope.$on('loadGame', () => {
        console.log("Load game in play state");
        loadGame();
    });
    $rootScope.$on('towerClicked', (event, tower) => {
        $scope.editing = true;
        $scope.selectedTower = tower;
        $scope.selectedTower.imgUrl = "/images/tower-defense-turrets/turret-" + $scope.selectedTower.imgNum + '-' + "1" + ".png";
        $scope.$digest();
    });
    $rootScope.$on('setEditing', (event, editing) => {
        $scope.editing = editing;
        $scope.$digest();
    });
    $rootScope.$on('choseADifferentMap', (event, mapNum) => {
        restart(mapNum);
    });
    $rootScope.$on("currentTower", (event, tower) => {
        $scope.tower = tower;
    });
    $rootScope.$on("initiateWave", (event, passedWave) => {
        $scope.setUp = false;
        $scope.playing = true;
        passedWave.initiateWave();
    });
    $rootScope.$on("readyForNextWave", (event) => {
        StateFactory.initiateWave();
    });
    $rootScope.$on('restartLevel', (event) => {
        restart();
    });
    $scope.tower = null;
    $('canvas').on('click', (e) => {
        if ($scope.tower !== null) {
            let towerPositionX = Math.floor(e.offsetX / StateFactory.cellSize);
            let towerPositionY = Math.floor(e.offsetY / StateFactory.cellSize);
            let selectedGrid = StateFactory.map.grid[towerPositionY][towerPositionX];
            if (!selectedGrid.contains.tower && typeof StateFactory.map.grid[towerPositionY][towerPositionX].terrain === "string") {
                if (PlayerFactory.money - $scope.tower.price >= 0) {
                    TowerFactory.createTower(towerPositionX, towerPositionY, $scope.tower.name + "Tower");
                    PlayerFactory.money -= $scope.tower.price;
                    $scope.$digest();
                }
            } else {
                console.log("Can't play");
            }
        }
        $scope.tower = null;
    })
    GameFactory.loop(Date.now());
});

