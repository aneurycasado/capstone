'use strict'
let PIXI = require('pixi.js');

let createGrid = (rows, cols, cellSize) => {
    let grid = [];
    for (let row = 0; row < rows; row++) {
        grid[row] = [];
        for (let col = 0; col < cols; col++) {
            if (row === 0) new GridNode(col, row, cellSize, {img: "13"});
            else {
                grid[row][col] = new GridNode(col, row, cellSize, {img: "01"});
            }
        }
    }
    return grid;
}

class GridNode {
    constructor(x, y, cellSize, opts) {
        console.log('cellSize', cellSize);
        this.x = x;
        this.y = y;
        this.coords = {x: x * cellSize, y: y * cellSize};
        this.enterable = true;
        this.contains = false;

        if (opts) {
            if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
            this.img.position.x = this.coords.x;
            this.img.position.y = this.coords.y;
        }
    }
}

module.exports = {
    createGrid
}
