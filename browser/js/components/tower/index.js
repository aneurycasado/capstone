'use strict'
let game = require('../game');
let PIXI = require('pixi.js');

class Tower {
    constructor(x,y,options) {
        //this.grid = grid;
        this.position = {x: x, y: y};
        this.rank = 1;
        this.kills = 0;
        this.options = options ? options : {};

        this.x = img.position.x;
        if(options){
            if(options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
            this.img.position.x = this.position.x * game.cellSize + .5*game.cellSize;
            this.img.anchor.x = .5;
            this.img.anchor.y = .5;
            this.img.position.y = this.position.y * game.cellSize + .5*game.cellSize;
            if(options.power) this.power = options.power;
            if(options.cost) this.cost = options.cost;
            game.stages["play"].addChild(this.img);
        }
        this.codeSnippets = [];
    }
    addKill() {
        this.kills++;
        if(this.kills === 20) this.rank = 2;
        else if(this.kills === 60) this.rank = 3;
    }

    setImage() {
        
    }

}


function createTower(x, y, type) {
    var towerConstructor = towers[type];
    return new towerConstructor(x,y);
}


class IceTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '4', power: 2});
    }
}

class LaserTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '6', power: 8});
    }
}

//class LightningTower extends Tower {
//    constructor(x, y) {
//        super(x, y, {img:})
//    }
//}

var towers = {IceTower, LaserTower};

module.exports = {
    createTower
};
