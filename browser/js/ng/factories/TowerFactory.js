'use strict'
app.factory('TowerFactory', function ($rootScope, EnemyFactory, ProjectileFactory, StateFactory, ParticleFactory, ClickHandlerFactory) {
    let data = StateFactory;

    let allTowers = [];

    let stage = new PIXI.Stage();

    class Tower {
        constructor(x, y, options) {
            //this.grid = grid;
            this.range = null;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            this.reloading = false;
            this.imgNum = options.img;
            $rootScope.$on('deadEnemy', function(event, deadEnemy){
                if(deadEnemy == this.target) {
                    this.target = null;
                    if(this.particleEmitter){
                        this.particleEmitter.destroy();
                        this.particleEmitter = null;
                    }
                }

            }.bind(this));
            this.session = null;
            this.powerUps = [];
            this.codeSnippet = null;
            for(let opt in options){
                this[opt] = options[opt];
            }
            let array = [];
            for(let i=1; i < 4; i++){
                let img = PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + i + ".png");
                array.push(img)
            }
            this.imgContainer = new PIXI.Container();
            this.img = new PIXI.extras.MovieClip(array);
            this.img.interactive = true;
            this.img.position.x = this.position.x * StateFactory.cellSize + (StateFactory.cellSize / 2);
            this.img.position.y = this.position.y * StateFactory.cellSize + (StateFactory.cellSize / 2);
            this.img.anchor.x = .5;
            this.img.anchor.y = .5;
            this.img.animationSpeed = .1;
            this.imgContainer.addChild(this.img);
            stage.addChild(this.imgContainer);

            this.baseRangeCircle = new PIXI.Graphics();
            this.baseRangeCircle.beginFill(0xFFFF99, .4);
            this.baseRangeCircle.lineStyle(2, 0xFFFF99);
            this.baseRangeCircle.drawCircle(this.img.position.x, this.img.position.y, this.range);
            this.targetingFunction = null;

            this.img.click = ClickHandlerFactory.towerClickHandler.bind(this);

            allTowers.push(this);
        }

        getCurrentTarget() {
            if(this.target) {
                //console.log(this.target.getSpeed());
                return {
                    enemyIndex: EnemyFactory.enemies.indexOf(this.target),
                    health: this.target.getHealth(),
                    speed: this.target.getSpeed(),
                    position: this.target.getPosition(),
                    name: this.target.getName()
                }
            }
            // return this.target;
        }
        setTarget(enemy) {
            this.target = enemy;
        }

        setTargetBasedOnIndex(index) {
            this.setTarget(EnemyFactory.enemies[index]);
        }

        getEnemies() {
            let enemies = EnemyFactory.enemies;
            let arr = [];
            for (let i = enemies.length - 1; i >= 0; i--) {
                if (this.isEnemyInRange(enemies[i])) {
                    arr.push({
                        enemyIndex: i,
                        health: enemies[i].getHealth(),
                        speed: enemies[i].getSpeed(),
                        position: enemies[i].getPosition(),
                        name: enemies[i].getName()
                    })
                }
            }
            return arr;
        }

        towerInRange(tower) {
            let distance = Math.sqrt(
                Math.pow(tower.img.position.x - this.position.img.x, 2) +
                Math.pow(tower.img.position.y - this.position.img.y, 2)
            );
            return distance <= this.range;
        }

        getNearbyTowers() {
            let self = this;
            let arr = [];
            allTowers.forEach(tower => {
                if(tower !== self && self.towerInRange(tower)) {
                    arr.push(tower);
                }
            });
            return arr;
        }
        getNearbyTowersEncapsulated() {
            let self = this;
            let arr = [];
            allTowers.forEach(tower => {
                if(tower !== self && self.towerInRange(tower)) {
                    arr.push({
                        getCurrentTarget: self.getCurrentTarget.bind(tower),
                        getEnemies: self.getEnemies.bind(tower),
                        getNearbyTowers: self.getNearbyTowersEncap.bind(tower),
                    })
                }
            });
            return arr;
        }

        evalCodeSnippet() {
            if(!this.codeSnippet) return;
            let newArg = this.codeSnippet.match(/\(context\)/)[0].replace('(', '').replace(')', '');
            let newFunc = this.codeSnippet.replace(/^function\s*\(context\)\s*\{/, '').replace(/}$/, '');
            let targetFunc = new Function(newArg, newFunc);
            this.targetingFunction = () => {
                return targetFunc.call(null, {
                    getCurrentTarget: this.getCurrentTarget.bind(this),
                    getEnemies: this.getEnemies.bind(this),
                    setTarget: this.setTargetBasedOnIndex.bind(this),
                    getNearbyTowers: this.getNearbyTowersEncapsulated.bind(this)
                });
            };
        }
        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        terminate() {
            stage.removeChild(this.imgContainer);
            allTowers.splice(allTowers.indexOf(this), 1);
        }

        countPowerUps() {
            return this.powerUps.length + this.codeSnippets.length;
        }

        acquireTarget(){
            if(this.targetingFunction) {
                this.targetingFunction();
                return true;
            }
            else {
                if(!this.target) {
                    for(let i = EnemyFactory.enemies.length - 1; i >= 0; i--){
                        if(this.isEnemyInRange(EnemyFactory.enemies[i])){
                            
                            if(this.name == "Meteor") StateFactory.sloMo = true;

                            setTimeout(function(){

                                StateFactory.sloMo = false;
                            },3500)

                            this.target = EnemyFactory.enemies[i];
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        isEnemyInRange(enemy){

            return((Math.pow(enemy.position.x - this.img.position.x, 2) + Math.pow(enemy.position.y - this.img.position.y, 2) <= Math.pow(this.range, 2)));
        }

        update(){
            this.acquireTarget(); //FIXME
            if(!this.target){
                //this.acquireTarget();
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
        newTower = new towerConstructor(x, y);
        currentGridNode.contains.tower = newTower;
        return newTower;
    }

    class IceTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '4',
                power: 2,
                price: 50,
                reloadTime: 400,
                range: 200,
                name: "Ice",
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.IceProjectile({
                power: this.power,
                x: this.img.position.x, y:
                this.img.position.y,
                speed: 200,
                radius: 8,
                enemy: enemy
            });
        }
    }

    class BlizzardTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '4',
                power: 2,
                price: 50,
                reloadTime: 400,
                range: 200,
                name: "Blizzard",
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.BlizzardProjectile({
                power: this.power,
                x: this.img.position.x, y:
                this.img.position.y,
                speed: 0,
                radius: 200,
                enemy: enemy
            });
        }
    }

    class FireTower extends Tower {
        constructor(x, y){
            super(x, y, {
                img: '7',
                power: 3,
                price:50,
                reloadTime: 1000,
                range: 200,
                name: "Fire",
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.FireProjectile({x: this.img.position.x, y: this.img.position.y, speed: 50, radius: 0, enemy: enemy});
        }
    }

    class MeteorTower extends Tower {
        constructor(x, y){
            super(x, y, {
                img: '7',
                power: 10,
                price:50,
                reloadTime: 1000,
                range: 200,
                name: "Meteor",
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.MeteorProjectile({x: enemy.position.x, y: -50, speed: 300, radius: 50, enemy: enemy});
        }
    }

    class FlameTower extends Tower {
        constructor(x, y){
                super(x, y, {
                img: '7',
                power: 0.2,
                price: 50,
                range: 200,
                name: "Flame",
                effect: 'Fill in'
            });
            this.flameCircleCenters = [];
            this.numOfFlameCircles = 5;
            this.flameCircleRadius = 8;
         }

         update(delta){
            this.acquireTarget(); //FIXME
            if(!this.target){
                //this.acquireTarget();
                this.img.stop();
                //this.target = EnemyFactory.enemies[0];
            }
            if(this.target){

                if(!this.isEnemyInRange(this.target)) {
                    this.target = null;
                    this.particleEmitter.destroy();
                    this.particleEmitter = null;
                }
                else{
                    if(!this.particleEmitter){
                        this.particleEmitter = new ParticleFactory.createEmitter('flame', stage);
                        this.calcRotation();
                        this.particleEmitter.updateOwnerPos(this.img.position.x, this.img.position.y);
                    }
                    this.calcRotation();
                    this.particleEmitter.update(delta);
                    this.calcFlameCircles();
                    this.checkFlameCircleRadii();
                }
                //else
            }
        }
        calcRotation(){
            this.particleEmitter.rotation = (-57.3 * (Math.atan2((this.target.imgContainer.position.x - this.img.position.x) , (this.target.imgContainer.position.y - this.img.position.y))) + 180);
        }

        checkFlameCircleRadii(){
            var self = this;
            var inFire = false;
            EnemyFactory.enemies.forEach(function(enemy){
                self.flameCircleCenters.forEach(function(flameCircleCenter){
                    if(self.checkRadius(self, enemy)){
                        inFire = true;
                    }
                });
                if(inFire) enemy.takeDamage(self.power);
                inFire = false;
            });
        }

        checkRadius(center, enemy){
            return Math.pow(enemy.position.x - this.img.position.x, 2) + Math.pow(enemy.position.y - this.img.position.y, 2) <= Math.pow(this.range, 2);
        }

        calcFlameCircles(){
            var xDiff = this.target.img.position.x - this.img.position.x;
            var yDiff = this.target.img.position.y - this.img.position.y;
            for(var i = 0; i < this.numOfFlameCircles; i++){
                this.flameCircleCenters[i] = {
                    x: xDiff / this.numOfFlameCircles,
                    y: yDiff / this.numOfFlameCircles
                };
            }
        }
    }

    class ThunderTower extends Tower {
        constructor(x, y){
            super(x, y, {
                img: '5',
                power: 30,
                price: 50,
                range: 800,
                reloadTime: 2000,
                name: "Thunder",
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.ThunderBallProjectile({
                x: this.img.position.x, 
                y: this.img.position.y, 
                power: this.power,
                speed: 4000, 
                radius: 14, 
                enemy: enemy});
        }
    }

    class PoisonTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '6',
                power: 8,
                price: 50,
                reloadTime: 1000,
                range: 200,
                name: 'Poison',
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            new ProjectileFactory.PoisonProjectile({
                x: this.img.position.x, 
                y: this.img.position.y, 
                speed: 100, 
                radius: 8, 
                enemy: enemy});
        }
    }

    let towers = {IceTower, ThunderTower, FireTower, PoisonTower, FlameTower, MeteorTower, BlizzardTower};
    // let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }

    let updateAll = (delta) => {
        allTowers.forEach((tower) => {
            if(tower.update) tower.update(delta);
        });

    };
    let resetTowers = () => {


        allTowers = [];

        return allTowers;
    }



    return {
        createTower,
        towers,
        updateAll,
        // prices,
        stage,
        resetTowers,
    };

});
