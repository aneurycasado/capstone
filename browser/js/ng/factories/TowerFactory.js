'use strict'
app.factory('TowerFactory', function($rootScope, EnemyFactory, ProjectileFactory, StateFactory, ParticleFactory, SpriteEventFactory, CodeEvalFactory, ModFactory, $timeout, SpriteGenFactory, LightningFactory, WeaponFactory) {

    let allTowers = [];
    let savedTowers = [];

    let stage = new PIXI.Stage();

    let burst = function () {
        let self = this;
        let temp = self.activeWeapon.reloadTime;
        self.activeWeapon.reloadTime = self.activeWeapon.reloadTime / 3;
        $timeout(function () {
            self.activeWeapon.reloadTime = temp;
        }, 3000);
    }
    let launchUltimate = function() {
        this.ultimateWeapon.shoot(this.target);
    }

    //name, functionToRun, context, coolDownPeriod, time=Date.now(), purchased=false
    class Tower {
        constructor(x, y, options) {
            this.range = null;
            this.position = {x: x, y: y};
            this.rank = 1;
            this.kills = 0;
            this.reloading = false;
            this.imgNum = options.img;
            $rootScope.$on('deadEnemy', (event, deadEnemy) => {
                if(deadEnemy === this.target) {
                    this.target = null;
                    if (this.particleEmitter) {
                        this.particleEmitter.destroy();
                        this.particleEmitter = null;
                    }
                }
            });
            this.mods = {
                surroundings: [
                    new ModFactory.Surrounding('getEnemies', this.getEnemies, this, true),
                    new ModFactory.Surrounding('getNearbyTowers', this.getNearbyTowersEncapsulated, this, true)
                ],
                abilities: [
                    new ModFactory.Ability('burst', burst, this, 25000, true),
                    new ModFactory.Ability('ultimateWeapon', launchUltimate, this, 30000, true)
                ],
                effects: [],
                consumables: []
            };

            this.codeSnippet = null;
            for (let opt in options) {
                this[opt] = options[opt];
            }
            if (this.primaryWeaponConstructor) {
                this.primaryWeapon = new this.primaryWeaponConstructor(this);
                this.activeWeapon = this.primaryWeapon;
            }
            if (this.secondaryWeaponConstructor) {
                this.secondaryWeapon = new this.secondaryWeaponConstructor(this);
            }
            if(this.ultimateWeaponConstructor) {
                this.ultimateWeapon = new this.ultimateWeaponConstructor(this);
            }

            let array = [];
            for (let i = 1; i < 4; i++) {
                array.push(PIXI.Texture.fromImage("/images/tower-defense-turrets/turret-" + options.img + '-' + i + ".png"));
            }

            let imgPositions = [this.position.x * StateFactory.cellSize + (StateFactory.cellSize / 2), this.position.y * StateFactory.cellSize + (StateFactory.cellSize / 2)]
            this.imgContainer = new PIXI.Container();
            SpriteGenFactory.attachSprite(this, new PIXI.extras.MovieClip(array), ...imgPositions);
            this.img.animationSpeed = .1;
            SpriteGenFactory.attachToContainer(this.imgContainer, this.img);
            stage.addChild(this.imgContainer);
            SpriteGenFactory.drawWeaponRangeCircle(this, this.activeWeapon.range);
            this.img.click = SpriteEventFactory.towerClickHandler.bind(this);
            this.towerControlFunction = null;
            //this.img.mouseover = SpriteEventFactory.towerMouseOverHandler.bind(this);
            //this.img.mouseout = SpriteEventFactory.towerMouseLeaveHandler.bind(this);

        }

        getCurrentTarget() {
            if (this.target) {
                //console.log(this.target.getSpeed());
                return {
                    index: EnemyFactory.enemies.indexOf(this.target),
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


        setTargetBasedOnIndex(enemy) {
            this.setTarget(EnemyFactory.enemies[enemy.index]);
        }

        getEnemies() {
            //let enemiesArr = [];
            let enemies = EnemyFactory.enemies;
            let arr = [];
            for (let i = enemies.length - 1; i >= 0; i--) {
                if (this.isEnemyInRange(enemies[i])) {
                    arr.push(enemies[i].enemyEncapsulated)
                }
            }
            return arr;
        }

        unlockMod(modName, category) {
            var currentArr;
            if (category) {
                currentArr = this.mods[category];
            } else {
                currentArr = [];
                let keys = Object.keys(this.mods);
                for (let i; i < keys; i++) {
                    currentArr = currentArr.concat(this.mods[keys[i]]);
                }
            }
            for (let i = 0; i < currentArr.length; i++) {
                if (currentArr[i].name === modName) currentArr[i].purchased = true;
            }
        }
        swapToSecondary() {
            this.activeWeapon = this.secondaryWeapon;
        }

        swapToPrimary() {
            this.activeWeapon = this.primaryWeapon;
        }

        towerInRange(tower) {
            let distance = Math.sqrt(
                Math.pow(tower.img.position.x - this.position.img.x, 2) +
                Math.pow(tower.img.position.y - this.position.img.y, 2)
            );
            return distance <= this.activeWeapon.range;
        }

        getNearbyTowers() {
            let self = this;
            let arr = [];
            allTowers.forEach(tower => {
                if (tower !== self && self.towerInRange(tower)) {
                    arr.push(tower);
                }
            });
            return arr;
        }

        getNearbyTowersEncapsulated() {
            let self = this;
            let arr = [];
            allTowers.forEach(tower => {
                if (tower !== self && self.towerInRange(tower)) {
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
            CodeEvalFactory.evalSnippet(this);
        }

        addKill() {
            this.kills++;
            if (this.kills === 20) this.rank = 2;
            else if (this.kills === 60) this.rank = 3;
        }

        terminate() {
            console.log("Terminate is called");
            console.log("The tower being terminated", this);
            stage.removeChild(this.imgContainer);
            console.log("All towers before splice", allTowers);
            allTowers.splice(allTowers.indexOf(this), 1);
            console.log("All towers after splice", allTowers);
            let removalIndex;
            savedTowers.forEach((tower, index) => {
                if (tower.x === this.position.x && tower.y === this.position.y) {
                    removalIndex = index;
                }
            })
            savedTowers.splice(removalIndex, 1);
        }

        acquireTarget() { //FIXME: should have a better name
            for (let i = EnemyFactory.enemies.length - 1; i >= 0; i--) {
                if (this.isEnemyInRange(EnemyFactory.enemies[i])) {
                    this.target = EnemyFactory.enemies[i];
                    return true;
                }
            }
        }

        isEnemyInRange(enemy) {
            return ((Math.pow(enemy.position.x - this.img.position.x, 2) + Math.pow(enemy.position.y - this.img.position.y, 2) <= Math.pow(this.activeWeapon.range, 2)));
        }

        update() {
            if (this.towerControlFunction) this.towerControlFunction();
            if (!this.target) {
                this.acquireTarget();
                this.img.stop();
                //this.target = EnemyFactory.enemies[0];
            }
            // console.log('reloadTime', this.activeWeapon.reloadTime);
            if (this.target) {
                // console.log('enemy health', this.target.health);
                if (!this.reloading) {
                    this.shoot(this.target);
                    this.reloading = true;
                    window.setTimeout(function () {
                        this.reloading = false;
                    }.bind(this), this.activeWeapon.reloadTime);
                }
                if (!this.isEnemyInRange(this.target)) this.target = null;
            }
        }
    }

    class IceTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '4',
                price: 50,
                // range: 200,
                primaryWeaponConstructor: WeaponFactory.IceWeapon,
                name: "Ice",
                effect: 'Fill in',
            });
        }

        shoot(enemy) {
            this.activeWeapon.shoot(enemy);
        }
    }

    // class BlizzardTower extends Tower {
    //     constructor(x, y) {
    //         super(x, y, {
    //             img: '4',
    //             power: .00001,
    //             price: 50,
    //             reloadTime: 400,
    //             range: 200,
    //             name: "Blizzard",
    //             effect: 'Fill in'
    //         });
    //         this.ultimate = true;
    //         this.sloMoTime = 3500;
    //     }

    //     shoot(enemy){
    //         this.img.play();
    //         if(!this.proj) this.proj= new ProjectileFactory.BlizzardProjectile({
    //             power: this.power,
    //             x: this.img.position.x, y:
    //             this.img.position.y,
    //             speed: 0,
    //             radius: 200,
    //             enemy: enemy
    //         });
    //     }
    // }

    class FireTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '7',
                price: 50,
                primaryWeaponConstructor: WeaponFactory.FireWeapon,
                secondaryWeaponConstructor: WeaponFactory.FlameWeapon,
                ultimateWeaponConstructor: WeaponFactory.MeteorWeapon,
                name: "Fire",
                effect: 'Fill in'
            });
        }
        shoot(enemy){
            this.img.play();
            this.activeWeapon.shoot(enemy);      
        }
    }


    // class MeteorTower extends Tower {
    //     constructor(x, y){
    //         super(x, y, {
    //             img: '7',
    //             power: 10,
    //             price:50,
    //             reloadTime: 1000,
    //             range: 200,
    //             name: "Meteor",
    //             effect: 'Fill in'
    //         });
    //     }
    //
    //     shoot(enemy){
    //         this.img.play();
    //         if(!this.projectile) this.projectile = new ProjectileFactory.MeteorProjectile({x: enemy.position.x, y: -50, speed: 300, radius: 50, enemy: enemy});
    //     }
    // }



    class ThunderTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '5',
                price: 50,
                range: 800,
                primaryWeaponConstructor: WeaponFactory.ThunderWeapon,
                name: "Thunder",
                effect: 'Fill in'
            });
        }

        shoot(enemy) {
            this.activeWeapon.shoot(enemy);
        }


    }

    class LightningTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '5',
                power: 30,
                price: 50,
                range: 120,
                reloadTime: 300,
                name: "Lightning",
                effect: 'Fill in'
            });

            this.ultimate = true;
            this.sloMoTime = 400;
        }
        shoot(enemy) {
            this.tower.img.play();

            setTimeout(function(){
                var start = new LightningFactory.Yals.Vector2D(enemy.position.x, -100);
                var end = new LightningFactory.Yals.Vector2D(enemy.position.x, enemy.position.y);

                this.proj = new LightningFactory.BranchLightning(start,end, '#FFFFFF', 6);
                enemy.terminate(true);


            }.bind(this), 250)

        }

        update(){
            super.update();

            if (this.proj) {

                this.proj.update();

            }

            LightningFactory.ctx.clearRect(0, 0, LightningFactory.scene.width, LightningFactory.scene.width);
            if (this.proj){

                $(StateFactory.renderer.view).css({'z-index' : '1'})
                $(LightningFactory.scene.canvasElement).css({'z-index' : '2'});

                this.proj.render(LightningFactory.ctx);

            }

        }
    }

    class PoisonTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '6',
                price: 50,
                range: 400,
                primaryWeaponConstructor: WeaponFactory.PoisonWeapon,
                name: "Poison",
                effect: 'Fill in'
            });
        }

        swapToPrimary() {
            this.activeWeapon = this.weaponArmory.primary;
        }

        swapToSecondary() {
            this.activeWeapon = this.weaponArmory.secondary;
        }

        shoot(enemy) {
            this.activeWeapon.shoot(enemy);
        }
    }

    class GasTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '6',
                power: .1,
                price: 50,
                reloadTime: 3000,
                range: 100,
                name: 'Gas',
                effect: 'Fill in'
            });
        }

        shoot(enemy){
            this.img.play();
            var self = this;
            this.particleEmitter = ParticleFactory.createEmitter('gas', stage);
            this.particleEmitter.updateOwnerPos(this.img.position.x, this.img.position.y);
            EnemyFactory.enemies.forEach(function(enemy){
                if(self.isEnemyInRange(enemy)){
                    enemy.poisoned = true;
                    enemy.poisonDamage = self.power;
                    if(!enemy.particleEmitters.poison){
                        enemy.particleEmitters.poison = ParticleFactory.createEmitter('poison', stage);
                    }
                }
            });
        }

        update(delta){
            super.update(delta);
            if(this.particleEmitter){
                this.particleEmitter.update(delta);
            }
        }
    }

    //let towers = {IceTower, ThunderTower, FireTower, FlameTower, PoisonTower, GasTower, BlizzardTower, MeteorTower};
    // let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }
    //removed FlameTower, MeteorTower, and BlizzardTower to be refactored into weapons and abilities
    //put back in IceTower
    let towers = {IceTower, ThunderTower, FireTower, PoisonTower};

    function createTower(x, y, name) {
        let towerConstructor = towers[name];
        let newTower = new towerConstructor(x, y);
        let currentGridNode = StateFactory.map.grid[y][x];
        allTowers.push(newTower);
        savedTowers.push({name: name, x: x, y: y});
        currentGridNode.contains.tower = newTower;
        console.log("allTower length", allTowers.length)
        return newTower;
    }

    function removeTower(tower) {
        console.log("Tower being removed in removeTower", tower);
        console.log("Length", allTowers.length);
        for (let i = 0; i < allTowers.length; i++) {
            let currentTower = allTowers[i];
            if (currentTower.position.x === tower.position.x && currentTower.position.y === tower.position.y) {
                currentTower.terminate();
                break;
            }
        }
        let currentGridNode = StateFactory.map.grid[tower.position.y][tower.position.x];
        currentGridNode.contains.tower = null;
    }

    let updateAll = (delta) => {
        allTowers.forEach((tower) => {
            if (tower.update) tower.update(delta);
        });
    };
    let resetTowers = () => {

        allTowers.length = 0;
        savedTowers.length = 0;

        return allTowers;
    }


    return {
        createTower,
        removeTower,
        towers,
        updateAll,
        savedTowers,
        stage,
        resetTowers,
    };

});
