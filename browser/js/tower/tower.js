'use strict'
class Tower {
    constructor(x,y,options) {
        //this.grid = grid;
        this.position = {x: x, y: y};
        this.options = options ? options : {};
        if(options){
            if(options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + ".png"));
            this.img.position.x = this.position.x * game.cellWidth + .5*game.cellWidth;
            this.img.anchor.x = .5;
            this.img.anchor.y = .5;
            this.img.position.y = this.position.y * game.cellHeight + .5*game.cellHeight;
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
    var towerPositionX = Math.floor(e.clientX / game.cellWidth)
    var towerPositionY = Math.floor(e.clientY / game.cellHeight)
    console.log('x:', towerPositionX);
    console.log('y:', towerPositionY);
    createTower(towerPositionX, towerPositionY, 'IceTower');
}
