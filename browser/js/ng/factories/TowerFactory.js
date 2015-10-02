app.factory('TowerFactory', function(GameFactory) {
    class Tower {
        constructor(x,y,options) {
            //this.grid = grid;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            //this.options = options ? options : {};
            this.codeSnippets = [];
            if(GameFactory.grid[y][x].canPlaceTower){
                if(options){
                    if(options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
                    this.img.position.x = this.position.x * GameFactory.cellSize + .5*GameFactory.cellSize;
                    this.img.anchor.x = .5;
                    this.img.anchor.y = .5;
                    this.img.position.y = this.position.y * GameFactory.cellSize + .5*GameFactory.cellSize;
                    if(options.power) this.power = options.power;
                    if(options.cost) this.cost = options.cost;
                    GameFactory.stages["play"].addChild(this.img);
                }
            } else {
                console.log("Can't play");
            }
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

    return createTower;
});
