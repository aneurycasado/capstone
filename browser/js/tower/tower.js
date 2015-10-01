'use strict'
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
    console.log(towers);
    var towerConstructor = towers[type];
    return new towerConstructor(x,y);
}


class IceTower extends Tower {
    constructor(x, y) {
        super(x, y, {img: '4-1'});
    }
}

var towers = {IceTower: IceTower};


document.onclick = function(e) {
    console.log(e.clientX);
    console.log(game.cellSize);
    var towerPositionX = Math.floor(e.clientX / game.cellSize)
    var towerPositionY = Math.floor(e.clientY / game.cellSize)
    console.log('x:', towerPositionX);
    console.log('y:', towerPositionY);
    createTower(towerPositionX, towerPositionY, 'IceTower');
}
