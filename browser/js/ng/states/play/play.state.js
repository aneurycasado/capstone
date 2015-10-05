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

app.controller('PlayController', function ($scope, player, $timeout, $rootScope, ParticleFactory, WaveFactory, MapFactory, GameFactory, TowerFactory, GridFactory, PlayerFactory, EnemyFactory, ProjectileFactory) {
    var game = GameFactory;
    console.log("Player from resolve ", player);
    var start = map => {
        console.log('hey',map.stage);
        game.map = map;
        GridFactory.grid = game.map.grid;
        GameFactory.stages.play = map.stage;
        game.PEContainer = new PIXI.Stage();
        GameFactory.stages.play.addChild(game.PEContainer);
        ParticleFactory.createFire(game.PEContainer, function(emitter){
            console.log("EMITTER", emitter);
            game.fire = emitter;
        });
        game.state = "play";
    };

    var init = () => {
        GameFactory.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
        GameFactory.waves.forEach(function(wave,i){
            WaveFactory.createWave(wave);
        });
        WaveFactory.setCurrentWave();
        game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
        document.body.appendChild(game.renderer.view);
        start(MapFactory.maps[0]);
    };

    init();



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

    game.launchCritters = false;
    game.nextWave = false;
    
    var checkNodeClear = nodeNum => {
        if(!EnemyFactory.enemies.length) return true;
        return EnemyFactory.enemies[EnemyFactory.enemies.length - 1].pathIndex === nodeNum;
    };

    var loadEnemy = () => {
        if(checkNodeClear(3)) {
            if(!WaveFactory.currentWaveLength()) return;
            var newEn = EnemyFactory.createEnemy(WaveFactory.popOffCurrentWave(), game.map.path);
            GameFactory.stages.play.addChild(newEn.img);
        }
    };
    game.initiateWave = () => {
        game.launchCritters = true;
    };

    if(game.launchCritters){
            loadEnemy();
        } 
        ProjectileFactory.updateAll();
        TowerFactory.updateAll();
        let enemies = EnemyFactory.enemies.map(element => element);
        for(let i = 0; i < enemies.length; i++) {
            if(enemies[i].moveTowards(delta)) {
                if(EnemyFactory.enemies.length === 0 && game.launchCritters){
                    WaveFactory.removeCurrentWave();
                    game.nextWave = true;
                    game.launchCritters = false;
                }
                PlayerFactory.health--;
            }
        }

    var update = then => {
        var now = Date.now();
        var delta = (now - then)/1000;
        if (GameFactory.state === "menu"){
        }
        else if (GameFactory.state === "play") {
            if(GameFactory.nextWave){
                GameFactory.nextWave = false;
                console.log('we hit in play state.js')
                $rootScope.$emit("nextWave")
                $scope.count++;
            }
            if(game.launchCritters){
                loadEnemy();
            } 
            ProjectileFactory.updateAll();
            TowerFactory.updateAll();
            EnemyFactory.updateAll(delta);
            //game.fire.update(delta/10);
            //game.fire.emit = true;
            //game.fire.updateOwnerPos(100, 100);
            //game.fire.rotate(counter++);
        }
        GameFactory.renderer.render(GameFactory.stages[GameFactory.state]);
        requestAnimationFrame(update.bind(null, now));
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
    update(Date.now());
});

