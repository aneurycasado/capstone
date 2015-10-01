'use strict'
let grid = require("../grid");
let PIXI = require('pixi.js');

let game = {
    width: 1000,

    rows: 13,
    cols: 20,
};

game.init = () => {

    game.stages = {};
    game.map = {};
    game.endRow = game.rows - 2;
    game.endCol = game.cols - 1;
    //base cell size on width
    game.cellSize = game.width / game.cols;
    //adjust height to fit grid
    game.height = (game.rows / game.cols) * game.width;
    game.stages.play = new PIXI.Stage(0x66FF99);
    game.renderer = PIXI.autoDetectRenderer(game.width, game.height);
    document.body.appendChild(game.renderer.view);
    game.grid = grid.createGrid(game.rows, game.cols, game.cellSize);
    game.grid.forEach(row => {
        row.forEach(gridNode => {
            game.stages.play.addChild(gridNode.img);
        })
    })
    game.state = "play";
    game.main();
};

game.main = ()=> {

    if (game.state == "play") {
        game.update();
    }
    game.renderer.render(game.stages[game.state]);
    requestAnimationFrame(game.main);
};

game.update = ()=> {

    //game logic
};

game.start = map => {
    game.state = "play";
};

module.exports = game;
