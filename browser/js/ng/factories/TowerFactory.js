'use strict'
app.factory('TowerFactory', function ($rootScope, EnemyFactory, ProjectileFactory, StateFactory, ParticleFactory) {
    let data = StateFactory;

    let allTowers = [];

    let stage = new PIXI.Stage();

    class Tower {
        constructor(x, y, options) {
            //this.grid = grid;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            this.reloading = false;
            $rootScope.$on('deadEnemy', function(event, deadEnemy){
                if(deadEnemy == this.target) this.target = null;
            }.bind(this));
            this.session = null;
            //this.options = options ? options : {};
            this.powerUps = [];
            this.codeSnippet = null;
            this.targetingFunction = null;
            if (options) {
                let array = [];
                for(let i=1; i < 4; i++){
                    let img = PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + i + ".png");
                    array.push(img)
                }
                this.img = new PIXI.extras.MovieClip(array);
                // if (options.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + this.rank + ".png"));
                this.img.position.x = this.position.x * StateFactory.cellSize + .5 * StateFactory.cellSize;
                this.img.anchor.x = .5;
                this.img.anchor.y = .5;
                this.img.animationSpeed = .1;

                this.img.position.y = this.position.y * StateFactory.cellSize + .5 * StateFactory.cellSize;
                if (options.power) this.power = options.power;
                if (options.cost) this.cost = options.cost;
                if (options.range) this.range = options.range;
                if (options.reloadTime) this.reloadTime = options.reloadTime;
                this.price = options.price;
                stage.addChild(this.img);
            }
            this.context = {
                getCurrentTarget: function() {
                    return this.target;
                }.bind(this),
                setTarget: function(enemy) {
                    this.target = enemy;
                }.bind(this),
                getEnemies: () => {
                    let arr = [];
                    for (let i = EnemyFactory.enemies.length - 1; i >= 0; i--) {
                        if (this.isEnemyInRange(EnemyFactory.enemies[i])) {
                            arr.push(EnemyFactory.enemies[i])
                        }
                    }
                    return arr;
                },
            }
            allTowers.push(this);
        }

        //getContext() {
        //    let self = this;
        //    let obj = {
        //        getCurrentTarget: () => {
        //            return self.target;
        //        },
        //        setTarget: (enemy) => {
        //            self.target = enemy;
        //        },
        //        getEnemies: function () {
        //            let arr = [];
        //            for (let i = EnemyFactory.enemies.length - 1; i >= 0; i--) {
        //                if (this.isEnemyInRange(EnemyFactory.enemies[i])) {
        //                    arr.push(EnemyFactory.enemies[i])
        //                }
        //            }
        //            return arr;
        //        }
        //    };
        //    if(this.rank === 2) {
        //        //add additional properties
        //    }
        //    if(this.rank === 3) {
        //        //add additional properties
        //    }
        //
        //    return obj;
        //}

        evalCodeSnippet() {
            if(!this.codeSnippet) return;
            let newArg = this.codeSnippet.match(/\(context\)/)[0].replace('(', '').replace(')', '');
            let newFunc = this.codeSnippet.replace(/^function\s*\(context\)\s*\{/, '').replace(/}$/, '');
            let targetFunc = new Function(newArg, newFunc);
            this.targetingFunction = () => {
                return targetFunc.call(null, this.context)
            };
        }
        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        terminate() {
            stage.removeChild(this.img);
            allTowers.splice(allTowers.indexOf(this), 1);
        }

        countPowerUps() {
            return this.powerUps.length + this.codeSnippets.length;
        }

        acquireTarget(){
            for(let i = EnemyFactory.enemies.length - 1; i >= 0; i--){
                if(this.isEnemyInRange(EnemyFactory.enemies[i])){
                    this.target = EnemyFactory.enemies[i];
                    return true;
                }
            }
            return false;
        }

        isEnemyInRange(enemy){
            return((Math.pow(enemy.position.x - this.img.position.x, 2) + Math.pow(enemy.position.y - this.img.position.y, 2) <= Math.pow(this.range, 2)));
        }

        update(){
            if(!this.target){
                this.acquireTarget();
                this.img.stop();
                //this.target = EnemyFactory.enemies[0];
            }
            if(this.target){
                if(!this.reloading){
                    this.shoot(this.target);
                    this.reloading = true;
                    window.setTimeout(function(){
                        this.reloading = false;
                    }.bind(this), this.reloadTime);
                }
                if(!this.isEnemyInRange(this.target)) this.target = null;
            }
        }
    }

    function createTower(x, y, type) {
        let towerConstructor = towers[type];
        let newTower;
        let currentGridNode = data.map.grid[y][x];
        if (currentGridNode.canPlaceTower) {
            newTower = new towerConstructor(x, y);
            currentGridNode.contains.tower = newTower;
            currentGridNode.canPlaceTower = false;
            return newTower;
        } else {
            console.log("Can't play");
        }
    }

    class HomingTower extends Tower {
        constructor(x, y, opts) {
            super(x, y, opts);
            this.range = 200;
            this.reloadTime = 400;
        }

    }


    class IceTower extends HomingTower {
        constructor(x, y) {
            super(x, y, {img: '4', power: 2, price: 50});
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.IceProjectile({power: this.power, x: this.img.position.x, y: this.img.position.y, speed: 4, radius: 8, enemy: enemy});
        }
    }

    class FireTower extends HomingTower {
        constructor(x, y){
            super(x, y, {img: '7', power: 5, price:50});
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.FireProjectile({x: this.img.position.x, y: this.img.position.y, speed: 4, radius: 8, enemy: enemy});
        }
    }

    class StraightTower extends Tower {
        constructor(x, y) {
            super(x, y, {img: '5', power: 8, price: 50, range: 1000, reloadTime: 2000});
        }
    }

    class ThunderTower extends StraightTower {
        constructor(x, y){
            super(x, y, {img: '7', power: 5, price:50, reloadTime: 2000, range: 1000});
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.StraightProjectile({x: this.img.position.x, y: this.img.position.y, speed: 10, radius: 14, enemy: enemy});
        }
    }

    class PoisonTower extends HomingTower {
        constructor(x, y) {
            super(x, y, {img: '6', power: 8, price: 50});
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.PoisonProjectile({x: this.img.position.x, y: this.img.position.y, speed: 4, radius: 8, enemy: enemy});
        }
    }

    let towers = {IceTower, ThunderTower, FireTower, PoisonTower};
    let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }

    let updateAll = (delta) => {
        allTowers.forEach((tower) => {
            if(tower.update) tower.update(delta);
        });

        // if(ice) ice.update(delta);
        // if(ice) ice.emit = true;
    };
    let resetTowers = () => {


        allTowers = [];

        return allTowers;
    }



    return {
        createTower,
        updateAll,
        prices,
        stage,
        resetTowers,
    };

});
