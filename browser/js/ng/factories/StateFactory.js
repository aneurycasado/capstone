'use strict'
app.factory('StateFactory', function() {
    let game = {
        width: 1000,
        rows: 13,
        cols: 20
    };
    game.mode = "unset";
    game.cellSize =  game.width /  game.cols;
    game.height = (game.rows / game.cols) * game.width;
    game.stages = {
        play: new PIXI.Stage(),
        menu: new PIXI.Stage(),
        //standby: new PIXI.Stage(),
        //complete: new PIXI.Stage()
    };
    game.sloMoMod = 4;
    game.sloMo = false;
    return game;
});
