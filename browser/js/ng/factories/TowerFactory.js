'use strict'
app.factory('TowerFactory', function ($rootScope, EnemyFactory, ProjectileFactory, StateFactory,
                                      ParticleFactory, SpriteEventFactory, CodeEvalFactory, ModFactory,
                                      $timeout, SpriteGenFactory, WeaponFactory) {

    let allTowers = [];

    let stage = new PIXI.Stage();

    let burst = function() {
        let self = this;
        let temp = self.activeWeapon.reloadTime;
        self.activeWeapon.reloadTime = self.activeWeapon.reloadTime / 3;
        $timeout(function() {
            self.activeWeapon.reloadTime = temp;
        }, 3000);
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
            $rootScope.$on('deadEnemy', function(event, deadEnemy){
                if(deadEnemy == this.target) {
                    this.target = null;
                    if(this.particleEmitter){
                        this.particleEmitter.destroy();
                        this.particleEmitter = null;
                    }
                }
            }.bind(this));
            this.mods = {
                surroundings: [
                    new ModFactory.Surrounding('getEnemies', this.getEnemies, this, false),
                    new ModFactory.Surrounding('getNearbyTowers', this.getNearbyTowersEncapsulated, this, false)
                ],
                abilities: [
                    new ModFactory.Ability('burst', burst, this, 25000, true)
                ],
                effects: [],
                consumables: []
            };

            this.codeSnippet = null;
            for (let opt in options) {
                this[opt] = options[opt];
            }
            if(this.primaryWeaponConstructor) {
              this.primaryWeapon = new this.primaryWeaponConstructor(this);
              this.activeWeapon = this.primaryWeapon;
            }
            if(this.secondaryWeaponConstructor) {
              this.secondaryWeapon = new this.secondaryWeaponConstructor(this);
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
            stage.removeChild(this.imgContainer);
            allTowers.splice(allTowers.indexOf(this), 1);
        }

        acquireTarget() { //FIXME: should have a better name
            for (let i = EnemyFactory.enemies.length - 1; i >= 0; i--) {
                if (this.isEnemyInRange(EnemyFactory.enemies[i])) {
                    this.target = EnemyFactory.enemies[i];
                    if (this.name == "Meteor"){
                        StateFactory.sloMo = true;

                        setTimeout(function () {
                            StateFactory.sloMo = false;
                        }, 3500)
                    }

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
            console.log('reloadTime', this.activeWeapon.reloadTime);
            if (this.target) {
              console.log('enemy health', this.target.health);
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
    //             effect: 'Fill in',
    //         });
    //     }
    //     shoot(enemy) {
    //       this.img.play();
    //       if(!this.projectile) this.projectile = new ProjectileFactory.BlizzardProjectile({
    //           power: this.power,
    //           x: this.img.position.x, y:
    //           this.img.position.y,
    //           speed: 0,
    //           radius: 200,
    //           enemy: enemy
    //       });
    //     }
    // }

    class FireTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '7',
                price: 50,
                primaryWeaponConstructor: WeaponFactory.FireWeapon,
                secondaryWeaponConstructor: WeaponFactory.FlameWeapon,
                // reloadTime: 1000,
                // range: 200,
                name: "Fire",
                effect: 'Fill in'
            });
        }
        swapWeaponTo(weapon) {
          this.activeWeapon = this.weaponArmory[weapon];
        }
        shoot(enemy) {
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

    // class FlameTower extends Tower {
    //     constructor(x, y){
    //             super(x, y, {
    //             img: '7',
    //             power: 0.2,
    //             price: 50,
    //             range: 150,
    //             name: "Flame",
    //             effect: 'Fill in'
    //         });
    //         this.flameCircleCenters = [];
    //         this.numOfFlameCircles = 10;
    //         this.flameCircleRadius = 20;
    //         this.circles = [];
    //         this.baseRangeCircle.drawCircle(this.img.position.x, this.range);
    //      }
    //
    //      update(delta){
    //         this.acquireTarget(); //FIXME
    //         if(!this.target){
    //             //this.acquireTarget();
    //             this.img.stop();
    //             //this.target = EnemyFactory.enemies[0];
    //         }
    //         if(this.target){
    //
    //             if(!this.isEnemyInRange(this.target)) {
    //                 this.target = null;
    //                 this.particleEmitter.destroy();
    //                 this.particleEmitter = null;
    //             }
    //             else{
    //                 if(!this.particleEmitter){
    //                     this.particleEmitter = new ParticleFactory.createEmitter('flame', stage);
    //                     this.calcRotation();
    //                     this.particleEmitter.updateOwnerPos(this.img.position.x, this.img.position.y);
    //                 }
    //                 this.calcRotation();
    //                 this.particleEmitter.update(delta);
    //                 this.calcFlameCircleCenters();
    //                 this.dealDamage();
    //             }
    //             //else
    //         }
    //     }
    //     calcRotation(){
    //         this.particleEmitter.rotation = (-57.3 * (Math.atan2((this.target.imgContainer.position.x - this.img.position.x) , (this.target.imgContainer.position.y - this.img.position.y))) + 180);
    //     }
    //
    //     dealDamage(){
    //         var self = this;
    //         var inFire = false;
    //         EnemyFactory.enemies.forEach(function(enemy){
    //             self.flameCircleCenters.forEach(function(flameCircleCenter){
    //                 if(self.checkRadius(flameCircleCenter, enemy)){
    //                     inFire = true;
    //                 }
    //             });
    //             if(inFire) enemy.takeDamage(self.power);
    //             inFire = false;
    //         });
    //     }
    //
    //     checkRadius(center, enemy){
    //           let dx = center.x - enemy.img.position.x;
    //           let dy = center.y - enemy.img.position.y;
    //           let distance = Math.sqrt(dx * dx + dy * dy);
    //           return (distance < this.flameCircleRadius + enemy.radius);
    //     }
    //
    //     calcFlameCircleCenters(){
    //         var xDiff = this.target.img.position.x - this.img.position.x;
    //         var yDiff = this.target.img.position.y - this.img.position.y;
    //         var theta = Math.atan2(xDiff, yDiff);
    //         var farthestPoint = {
    //             x: this.range*Math.sin(theta),
    //             y: this.range*Math.cos(theta),
    //         };
    //         for(var i = 1; i <= this.numOfFlameCircles; i++){
    //             this.flameCircleCenters[i] = {
    //                 x: (farthestPoint.x / this.numOfFlameCircles) * i + this.img.position.x,
    //                 y: (farthestPoint.y / this.numOfFlameCircles) * i + this.img.position.y
    //             };
    //         }
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

    class PoisonTower extends Tower {
        constructor(x, y) {
            super(x, y, {
                img: '6',
                price: 50,
                range: 200,
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

    //removed FlameTower, MeteorTower, and BlizzardTower to be refactored into weapons and abilities
    //put back in IceTower
    let towers = {IceTower, ThunderTower, FireTower, PoisonTower};

    function createTower(x, y, name) {
        let towerConstructor = towers[name];
        let newTower = new towerConstructor(x, y);
        console.log(newTower);
        let currentGridNode = StateFactory.map.grid[y][x];
        allTowers.push(newTower);
        currentGridNode.contains.tower = newTower;
        return newTower;
    }

    function removeTower(tower){
        let currentGridNode = StateFactory.map.grid[tower.position.y][tower.position.x];
        let removeIndex = null;
        allTowers.forEach(function(currentTower,index){
            console.log("currenTower");
            if(currentTower.position.x === tower.position.x && currentTower.position.y === tower.position.y){
                console.log("Found a match");
                console.log("tower in allTower ", currentTower);
                console.log("Tower passed in ", tower);
                removeIndex = index;
            }
        });
        let towerToRemove = allTowers[removeIndex];
        currentGridNode.contains.tower = null;
        stage.removeChild(towerToRemove.imgContainer);
        allTowers.splice(removeIndex,1);
    }


    // let prices = {"Ice": 50,"Fire": 50, "Poison": 50, "Thunder": 50 }

    let updateAll = (delta) => {
        allTowers.forEach((tower) => {
            if (tower.update) tower.update(delta);
        });
    };
    let resetTowers = () => {


        allTowers = [];

        return allTowers;
    }


    return {
        createTower,
        removeTower,
        towers,
        updateAll,
        // prices,
        stage,
        resetTowers,
    };
});
