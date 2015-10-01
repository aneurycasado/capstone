'use strict'
let game = require('../game');
let PIXI = require('pixi.js');

class Tower {
    constructor(x,y,options) {
        //this.grid = grid;
        this.position = {x: x, y: y};
        this.options = options ? options : {};
        if(options){
            if(options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + ".png"));
            this.img.position.x = this.position.x * game.cellSize + .5*game.cellSize;
            this.img.anchor.x = .5;
            this.img.anchor.y = .5;
            this.img.position.y = this.position.y * game.cellSize + .5*game.cellSize;
            game.stages["play"].addChild(this.img);
        }
        this.codeSnippets = [];
    }
}


function createTower(x, y, type) {
    var towerConstructor = towers[type];
    return new towerConstructor(x,y);
}


class IceTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '4-1'});
    }
}

var towers = {IceTower: IceTower};

module.exports = {
    createTower
};
