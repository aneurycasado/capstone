'use strict'
let game = require('../game');
let PIXI = require('pixi.js');

class Tower {
    constructor(x,y,options) {
        //this.grid = grid;
        this.position = {x: x, y: y};
        this.level = 1;
        this.kills = 0;
        this.options = options ? options : {};
        if(options){
            if(options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.level + ".png"));
            this.img.position.x = this.position.x * game.cellSize + .5*game.cellSize;
            this.img.anchor.x = .5;
            this.img.anchor.y = .5;
            this.img.position.y = this.position.y * game.cellSize + .5*game.cellSize;
            game.stages["play"].addChild(this.img);
        }
        this.codeSnippets = [];
    }
    addKill() {
        this.kills++;
        if(this.kills === 20) this.level = 2;
        else if(this.kills === 60) this.level = 3;
    }
}


function createTower(x, y, type) {
    var towerConstructor = towers[type];
    return new towerConstructor(x,y);
}


class IceTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '4'});
    }

}

class LaserTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '6'})
    }
}

var towers = {IceTower: IceTower};

module.exports = {
    createTower
};
