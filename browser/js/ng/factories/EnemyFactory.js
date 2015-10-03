'use strict'

app.factory('EnemyFactory', function(GameFactory) {
    class Enemy {
        constructor(x, y, opts) {
            this.position = {x: x, y: y};
            this.img.position = this.position;
            if (opts) {
                if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-blue.png"));
                this.img.position.x = this.position.x * GameFactory.cellSize + .5 * GameFactory.cellSize;
                this.img.anchor.x = .5;
                this.img.anchor.y = .5;
                this.img.position.y = this.position.y * GameFactory.cellSize + .5 * GameFactory.cellSize;
                if (opts.power) this.power = opts.power;
                if (opts.cost) this.cost = opts.cost;
                GameFactory.stages["play"].addChild(this.img);
            }

            this.path = opts.path;
            this.pathIndex = 0;


        }
        moveTowards(modifier) {
            var xdone = false;
            var ydone = false;

            if(this.x > this.path[this.pathIndex].x + 5){
                this.x -= this.speed * modifier;
            }else if(this.x < this.path[this.pathIndex].x - 5){
                this.x += this.speed * modifier;
            }else{
                xdone = true;
            }

            if(this.y > this.path[this.pathIndex].y + 5){
                this.y -= this.speed * modifier;
            }else if(this.y < this.path[this.pathIndex].y - 5){
                this.y += this.speed * modifier;
            }else{
                ydone = true;
            }

            if(xdone && ydone){
                this.pathIndex++;
            }
        }
    }
    createEnemy = (x,y, type) => {
        let towerConstructor = towers[type];
        let newTower;
        let currentGridNode = GameFactory.grid[y][x];
        if (currentGridNode.canPlaceTower) {
            newTower = new towerConstructor(x, y);
            currentGridNode.contains.tower = newTower;
            currentGridNode.canPlaceTower = false;
            return newTower;
        } else {
            console.log("Can't play");
        }
        enemies.push(this);
    };

    var enemiesConstructors = {trojanHorse, adWare, worms};
    var enemies = [];
    return {
        createEnemy,
        enemies
    };
});
