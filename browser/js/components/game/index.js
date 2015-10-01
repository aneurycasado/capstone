'use strict'
let grid = require("../grid");
let maps = require("../maps");
let PIXI = require('pixi.js');

let game = require('./config');


game.init = () => {

    game.stages = {};
    game.map = {};
    game.endRow = game.rows - 2;
    game.endCol = game.cols - 1;
    //base cell size on width
    //adjust height to fit grid
    game.height = (game.rows / game.cols) * game.width;
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
    game.map = maps.maps[0];
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

module.exports = game;
