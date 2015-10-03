'use strict'
app.factory('GameFactory', function(ConfigFactory, MapFactory, EnemyFactory, PlayerFactory) {
    let game = ConfigFactory;
    game.cellSize = game.width / game.cols;
    game.height = (game.rows / game.cols) * game.width;

    game.init = () => {

        game.stages = {};
        game.map = {};
        game.stages.menu = new PIXI.Stage(0x66FF99);
        game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
        document.body.appendChild(game.renderer.view);

        game.map = MapFactory.maps[0];


        game.grid = game.map.grid;
        game.stages.play = new PIXI.Stage(0x66FF99);
        game.grid.forEach(row => {
            row.forEach(gridNode => {
                game.stages.play.addChild(gridNode.img);
            })
        });

        game.createCritter();

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
        game.renderer.render(game.stages[game.state]);
        requestAnimationFrame(game.main.bind(null, now));

    };

    game.createCritter = ()=> {
        var newEn;
            setTimeout(function() {
                newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
                game.stages["play"].addChild(newEn.img);
            }, 500);
            setTimeout(function() {
                newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);
                game.stages["play"].addChild(newEn.img);
            }, 100);
    };

    game.update = (delta)=> {
        //var enemies = EnemyFactory.enemies.map(function(element) {
        //    return element;
        //});
        EnemyFactory.enemies.forEach(function(en){
            if(en.moveTowards(delta)){
                game.stages["play"].removeChild(en.img);
                PlayerFactory.health--;
            }
        });
        //game logic
    };

    game.start = map => {
        console.log(EnemyFactory.enemies);

        game.state = "play";
    };
    return game;
});
