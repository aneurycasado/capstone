'use strict'
app.factory('GameFactory', function(ConfigFactory, ViewFactory, WaveFactory, GridFactory, TowerFactory, ParticleFactory, MapFactory, EnemyFactory, PlayerFactory, ProjectileFactory) {
    let game = ConfigFactory;
    game.cellSize = game.width / game.cols;
    game.height = (game.rows / game.cols) * game.width;
    game.waves = [[{name: 'trojanHorse', num: 12}], [{name: 'trojanHorse', num: 15}]];
    game.launchCritters = false;
    game.nextWave = false;
    game.init = () => {
        game.map = {};
        game.waves.forEach(function(wave,i){
            WaveFactory.createWave(wave);
        });
        WaveFactory.setCurrentWave();
        game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
        document.body.appendChild(game.renderer.view);
        game.start();


    };
    game.start = map => {
        game.map = MapFactory.maps[0];
        GridFactory.grid = game.map.grid;
        GridFactory.grid.forEach(row => {
            row.forEach(gridNode => {
                ViewFactory.stages.play.addChild(gridNode.img);
            });
        });

        game.state = "play";
    };
    game.checkNodeClear = nodeNum => {
        if(!EnemyFactory.enemies.length) return true;
        return EnemyFactory.enemies[EnemyFactory.enemies.length - 1].pathIndex === nodeNum;
    };

    game.loadEnemy = () => {
        if(game.checkNodeClear(3)) {
            if(!WaveFactory.currentWaveLength()) return;
            var newEn = EnemyFactory.createEnemy(WaveFactory.popOffCurrentWave(), game.map.path);
            ViewFactory.stages.play.addChild(newEn.img);
        }
    };

    game.update = delta => {
        if(game.launchCritters){
            game.loadEnemy();
        } 
        ProjectileFactory.updateAll();
        TowerFactory.updateAll(delta);
        let enemies = EnemyFactory.enemies.map(element => element);
        for(let i = 0; i < enemies.length; i++) {
            if(enemies[i].moveTowards(delta)) {
                ViewFactory.stages.play.removeChild(enemies[i].img);
                if(EnemyFactory.enemies.length === 0 && game.launchCritters){
                    WaveFactory.removeCurrentWave();
                    game.nextWave = true;
                    game.launchCritters = false;
                }
                // EnemyFactory.enemies.splice(i,1);
                PlayerFactory.health--;
            }
        }

    };
    game.initiateWave = () => {
        game.launchCritters = true;
    };

    return game;
});
