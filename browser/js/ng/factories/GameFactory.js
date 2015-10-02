app.factory('GameFactory', function(ConfigFactory, MapFactory) {
    let game = ConfigFactory;
    game.cellSize = game.width / game.cols;
    console.log('game.cellSize', game.cellSize);
    game.height = (game.rows / game.cols) * game.width;

    game.init = () => {
        game.stages = {};
        game.map = {};
        game.stages.menu = new PIXI.Stage(0x66FF99);
        game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
        document.body.appendChild(game.renderer.view);
        // game.grid = grid.createGrid(game.rows, game.cols, game.cellSize);
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

    game.update = ()=> {

        //game logic
    };

    game.start = map => {
        game.map = MapFactory.maps[0];
        console.log(game.map);
        game.grid = game.map.grid;
        game.stages.play = new PIXI.Stage(0x66FF99);
        game.grid.forEach(row => {
            row.forEach(gridNode => {
                game.stages.play.addChild(gridNode.img);
            })
        })

        game.state = "play";
    };
    return game;
});
