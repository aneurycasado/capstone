'use strict'
app.factory('TowerFactory', function (GameFactory, EnemyFactory, ProjectileFactory, ViewFactory) {
    class Tower {
        constructor(x, y, options) {
            //this.grid = grid;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            this.session = null;
            //this.options = options ? options : {};
            this.powerUps = [];
            this.codeSnippets = [];
            if (options) {
                if (options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
                this.img.position.x = this.position.x * GameFactory.cellSize + .5 * GameFactory.cellSize;
                this.img.anchor.x = .5;
                this.img.anchor.y = .5;
                this.img.position.y = this.position.y * GameFactory.cellSize + .5 * GameFactory.cellSize;
                if (options.power) this.power = options.power;
                if (options.cost) this.cost = options.cost;
                this.price = options.price;
                ViewFactory.stages.play.addChild(this.img);
            }
        }

        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        setImage() {

        }

        addCodeSnippet() {

        }

        countPowerUps() {
            return this.powerUps.length + this.codeSnippets.length;
        }

    }

    function createTower(x, y, type) {
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
    }

    class IceTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '4', power: 2, price: 50});
        }
    }

    class FireTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '7', power: 8, price:50});
            if(EnemyFactory.enemies[0])this.shoot(EnemyFactory.enemies[0]);
        }

        shoot(enemy){
            new ProjectileFactory.HomingProjectile({x: this.img.position.x, y: this.img.position.y, speed: 3, radius: 8, enemy: enemy});
        }
    }

    class ThunderTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '5', power: 8, price: 50});
        }
    }

    class PoisonTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '6', power: 8, price: 50});
        }
    }

    let towers = {IceTower, ThunderTower, FireTower, PoisonTower};
    let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }

    return {createTower, prices};
});
