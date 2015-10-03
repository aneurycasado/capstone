'use strict'
app.factory('GameFactory', function(ViewFactory, ConfigFactory, MapFactory, EnemyFactory, PlayerFactory, ProjectileFactory) {
    let game = ConfigFactory;
    game.cellSize = game.width / game.cols;
    game.height = (game.rows / game.cols) * game.width;

    game.init = () => {

        game.stages = {};
        game.map = {};
        ViewFactory.newStage('menu');
        game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
        document.body.appendChild(game.renderer.view);

        game.start();

        game.main();


    };

    game.main = (then)=> {

        var now = Date.now();
        var delta = (now - then)/1000;
        if (game.state === "menu"){
            //do menu stuff
        }

        if (game.state === "play") {
            game.update(delta);
        }
        game.renderer.render(ViewFactory.stages[game.state]);
        requestAnimationFrame(game.main.bind(null, now));

    };

    game.createCritter = ()=> {
        var newEn;
            setTimeout(function() {
                newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
                ViewFactory.stages.play.addChild(newEn.img);
            }, 500);
            setTimeout(function() {
                newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
                ViewFactory.stages.play.addChild(newEn.img);
            }, 1000);
        setTimeout(function() {
            newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
            ViewFactory.stages.play.addChild(newEn.img);
        }, 1500);
        setTimeout(function() {
            newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
            ViewFactory.stages.play.addChild(newEn.img);
        }, 2000);
        setTimeout(function() {
            newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
            ViewFactory.stages.play.addChild(newEn.img);
        }, 2500);
    };

    game.update = (delta)=> {
        ProjectileFactory.updateAll();
        var enemies = EnemyFactory.enemies.map(function(element) {
            return element;
        });

        for(var i = 0; i < enemies.length; i++) {
            if(enemies[i].moveTowards(delta)) {
                ViewFactory.stages.play.removeChild(enemies[i].img);
                PlayerFactory.health--;
            }
        }
        //game logic
    };

    game.start = map => {
        game.map = MapFactory.maps[0];


        game.grid = game.map.grid;
        ViewFactory.newStage('play');
        console.log('pixip', PIXI.Stage);
        game.grid.forEach(row => {
            row.forEach(gridNode => {
                ViewFactory.stages.play.addChild(gridNode.img);
            });
        });

        game.createCritter();

        game.state = "play";
    };
    return game;
});
