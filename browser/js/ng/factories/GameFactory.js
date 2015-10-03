'use strict'
app.factory('GameFactory', function(ConfigFactory, MapFactory, EnemyFactory) {
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

        console.log(game.map);

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

    game.main = ()=> {
        if (game.state === "menu"){
            //do menu stuff
        }

        if (game.state === "play") {
            game.update();
        }
        game.renderer.render(game.stages[game.state]);
        requestAnimationFrame(game.main);
    };

    game.createCritter = ()=> {

        var newEn = EnemyFactory.createEnemy("trojanHorse", game.map.path);

        console.log("NEWEN", newEn);
        game.stages["play"].addChild(newEn.img);
    };

    game.update = ()=> {

        EnemyFactory.enemies.forEach(function(en){
            en.moveTowards();
        });



        //game logic
    };

    game.start = map => {
        console.log(EnemyFactory.enemies);

        game.state = "play";
    };
    return game;
});
