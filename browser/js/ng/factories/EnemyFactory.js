'use strict'
//FIXME

app.factory('EnemyFactory', function($rootScope, ParticleFactory, StateFactory, PlayerFactory, SpriteGenFactory) {

    let explosionEmitters = [];
    let enemies = [];
    let terminatedEnemies = [];
    let stage = new PIXI.Stage();
    let findEnd = (img) => {
        if(img === "1") return 7;
        else return 5;
    }

    const findRandomPath = (opts) => {
        let rando = Math.floor( Math.random() * opts.path.length);
        let path = opts.path[rando];
        let pathIndex = 0;
        let position = {x: path[0].x, y: path[0].y};
        return {path, pathIndex, position};
    }

    class Enemy {
        constructor(opts) {
            this.particleEmitters = {};
            this.value = 0;
            //this.value = opts.value; <---- silly
            this.radius = 10;
            if (opts) {
                for(let opt in opts){
                    this[opt] = opts[opt];
                 }

                Object.assign(this, findRandomPath.call(this, opts));

                this.imgContainer = new PIXI.Container();
                if (opts.img) {
                    let array = [];
                    let end = findEnd(opts.img);
                    for(let i=1; i < end; i++){
                        let img = PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-" + opts.color +"/" + i.toString() + ".png");
                        array.push(img)
                    }
                    this.img = new PIXI.extras.MovieClip(array);
                }
                this.img.position = this.position;
                this.img.pivot.x = 0.5;
                this.img.pivot.y = 0.5;
                this.img.anchor.x  = 0.5;
                this.img.anchor.y = 0.5;
                this.img.animationSpeed = 0.5;
                this.img.play();
                if (opts.power) this.power = opts.power;
            }
            this.healthBar = new PIXI.Graphics();
            this.healthBar.beginFill(0xFF0000);
            this.healthBar.drawRect(-20, -25, 40, 2);
            this.imgContainer.addChild(this.img);
            this.imgContainer.addChild(this.healthBar);
            this.imgContainer.position = this.position;
            stage.addChild(this.imgContainer);
            this.slowFactor = 1;
            this.maxHealth = this.health;
            this.enemyEncapsulated = {
                getIndex: this.getIndex.bind(this),
                getHealth: this.getHealth.bind(this),
                getSpeed: this.getSpeed.bind(this),
                getPosition: this.getPosition.bind(this),
                name: this.getName()
            }
        }

        moveX(deltaSpeed){
            if(this.position.x > this.path[this.pathIndex].x + deltaSpeed) {
                if(!this.boss) this.img.rotation = 3.14;
                this.position.x -= deltaSpeed;

            } else if(this.position.x < this.path[this.pathIndex].x - deltaSpeed) {
                if(!this.boss) this.img.rotation = 3.14*2;
                this.position.x += deltaSpeed;
            } else{
                return true;
            }

            return false;
        }

        moveY(deltaSpeed){

            if(this.position.y > this.path[this.pathIndex].y + deltaSpeed) {
                if(!this.boss) this.img.rotation = (3*3.14) / 2;
                this.position.y -= deltaSpeed;
            }else if(this.position.y < this.path[this.pathIndex].y - deltaSpeed) {
                this.position.y += deltaSpeed;
                if(!this.boss) this.img.rotation = 3.14 / 2;
            }else{
                return true;
            }

            return false;

        }

        moveOnPath(delta) {
            let xdone = false;
            let ydone = false;

            let deltaSpeed = this.slowFactor * this.speed * delta;

            xdone = this.moveX(deltaSpeed);

            ydone = this.moveY(deltaSpeed);

            if(xdone && ydone){
                this.pathIndex++;
            }
        }

        terminate(explode){


            for(var i in this.particleEmitters){
                if(this.particleEmitters[i])this.particleEmitters[i].destroy();
            }
            $rootScope.$emit('deadEnemy', this);
            if(enemies.indexOf(this) !== -1) {
                enemies.splice(enemies.indexOf(this),1);
            }

            if(explode){
                explosionEmitters.push(ParticleFactory.createEmitter('critter1pieces', stage, ["core1", "wing1", "eye1", "ball1"]));
                explosionEmitters[explosionEmitters.length-1].updateOwnerPos(this.position.x, this.position.y);
            }

            stage.removeChild(this.img);
            stage.removeChild(this.healthBar);
            stage.removeChild(this.imgContainer);

            $rootScope.$emit("updateNumberOfEnemies");


        }

        update(delta){
            this.moveOnPath(delta);
            for(var i in this.particleEmitters){
                if(this.particleEmitters[i]){
                    this.particleEmitters[i].update(delta);
                    this.particleEmitters[i].updateOwnerPos(this.img.position.x, this.img.position.y);
                }
            }
            if(!this.path[this.pathIndex]) {
                PlayerFactory.health--;
                // if(PlayerFactory.health <= 0){
                //     // GameFactory.changeStateTo('gameOver');
                //     $rootScope.$emit('gameOver');
                //     console.log("Game over ", PlayerFactory.health);
                // }
                $rootScope.$digest();

                this.terminate(false);
            }
            if(this.poisoned) this.takeDamage(this.poisonDamage);
            // if(!this.circle){
            //         this.circle = new PIXI.Graphics();
            //         this.circle.beginFill(0xFFFF99, 0.4);
            //         this.circle.lineStyle(2, 0xFFFF99);
            //         this.circle.drawCircle(this.img.position.x, this.img.position.y, this.radius);
            //         stage.addChild(this.circle);
            //     }else{
            //         stage.removeChild(this.circle);
            //         this.circle = new PIXI.Graphics();
            //         this.circle.beginFill(0xFFFF99, 0.4);
            //         this.circle.lineStyle(2, 0xFFFF99);
            //         this.circle.drawCircle(this.img.position.x, this.img.position.y, this.radius);
            //         stage.addChild(this.circle);
            //     }
        }

        takeDamage(damage){
            this.health -= damage;
            var healthPercentage = this.health / this.maxHealth;
            this.healthBar.width = 40 * healthPercentage;

            if(!this.particleEmitters.damageSparks) this.particleEmitters.damageSparks = ParticleFactory.createEmitter('damageSparks', stage);

            if(this.health <= 0){
                console.log("This is true");
                PlayerFactory.money += this.value;
                terminatedEnemies.push(this);
                $rootScope.$digest();
                this.terminate(true);
            }
        }
        getHealth() {
            return this.health;
        }
        getSpeed() {
            return this.speed * this.slowFactor;
        }
        getPosition() {
            return this.position;
        }
        getName() {
            return this.constructor.name;
        }
        getIndex() {
            return enemies.indexOf(this);
        }
    }

     class SmallBugRed extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 1,
                speed: 128,
                health: 10,
                color: "red"
            });
        }
    }

    class SmallBugGreen extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 1,
                speed: 128,
                health: 10,
                color: "green"
            });

        }
    }

    class SmallBugBlue extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 1,
                speed: 128,
                health: 10,
                color: "blue"
            });
        }
    }

    class SmallBugYellow extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 1,
                speed: 128,
                health: 10,
                color: "yellow"
            });
        }
    }

    class BigBugRed extends Enemy {
        constructor(opts) {
            super({
                img: '2',
                power: 2,
                path: opts.path,
                value: 2,
                speed: 90,
                health: 30,
                color: "red"
            });
        }
    }

    class BigBugGreen extends Enemy {
        constructor(opts) {
            super({
                img: '2',
                power: 2,
                path: opts.path,
                value: 2,
                speed: 90,
                health: 30,
                color: "green"
            });
        }
    }

    class BigBugBlue extends Enemy {
        constructor(opts) {
            super({
                img: '2',
                power: 2,
                path: opts.path,
                value: 2,
                speed: 90,
                health: 30,
                color: "blue"
            });
        }
    }

    class BigBugYellow extends Enemy {
        constructor(opts) {
            super({
                img: '2',
                power: 2,
                path: opts.path,
                value: 3,
                speed: 90,
                health: 30,
                color: "yellow"
            });
        }
    }

    class SuperBigBugRed extends Enemy {
        constructor(opts) {
            super({
                img: '3',
                power: 2,
                path: opts.path,
                value: 3,
                speed: 100,
                health: 100,
                color: "red"
            });
        }
    }

    class SuperBigBugGreen extends Enemy {
        constructor(opts) {
            super({
                img: '3',
                power: 2,
                path: opts.path,
                value: 3,
                speed: 100,
                health: 100,
                color: "green"
            });
        }
    }

    class SuperBigBugBlue extends Enemy {
        constructor(opts) {
            super({
                img: '3',
                power: 2,
                path: opts.path,
                value: 3,
                speed: 100,
                health: 100,
                color: "blue"
            });
        }
    }

    class SuperBigBugYellow extends Enemy {
        constructor(opts) {
            super({
                img: '3',
                power: 2,
                path: opts.path,
                value: 3,
                speed: 100,
                health: 100,
                color: "yellow"
            });
        }
    }

    class BossBug extends Enemy {
        constructor(opts) {
            super({
                img: 'boss1',
                power: 2,
                path: opts.path,
                value: 100,
                speed: 10,
                health: 10000,
                color: 'none',
                boss: true,
            });
        }
    }

    let createEnemy = (type, path) => {
        let newEnemy;
        let enemyConstructor = enemiesConstructors[type];
        newEnemy = new enemyConstructor({path: path});
        enemies.push(newEnemy);
        return newEnemy;
    };

    let updateAll = (delta) => {
        enemies.forEach((enemy) => {
            enemy.update(delta);
        });

        explosionEmitters.forEach((emitter) => {
            emitter.update(delta);
        });
    };

    let restart = () => {
        for(let i = enemies.length -1; i >=0; i--){
            let enemy = enemies[i];
            enemy.terminate();
        };
        terminatedEnemies.length = 0;
    };


    let enemiesConstructors = {SmallBugRed,SmallBugGreen,SmallBugBlue,SmallBugYellow,
                               BigBugRed,BigBugGreen,BigBugBlue,BigBugYellow,
                               SuperBigBugRed,SuperBigBugGreen,SuperBigBugBlue,SuperBigBugYellow,
                               BossBug};

    //adWare, worm
    return {
        restart,
        stage,
        createEnemy,
        enemies,
        updateAll,
        terminatedEnemies
    };
});
