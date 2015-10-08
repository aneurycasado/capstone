'use strict'
//FIXME
app.factory('EnemyFactory', function($rootScope, ParticleFactory, StateFactory, PlayerFactory) {

    let explosionEmitters = [];
    let enemies = [];
    let stage = new PIXI.Stage();
    let findEnd = (img) => {
        if(img === "1") return 7;
        else return 5;
    }
    class Enemy {
        constructor(opts) {
            this.particleEmitters = {};
            if (opts) {
                for(let opt in opts){
                    this[opt] = opts[opt];
                 }
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
                this.position = {x: opts.path[0].x, y: opts.path[0].y};
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
            this.value = 0;
            this.maxHealth = this.health;
            this.radius = 10;
            this.path = opts.path;
            this.pathIndex = 0;
        }

        moveTowards(delta) {
            let xdone = false;
            let ydone = false;
            if(this.position.x > this.path[this.pathIndex].x + 5) {
                if(!this.boss) this.img.rotation = 3.14;
                this.position.x -= this.slowFactor * this.speed * delta;

            } else if(this.position.x < this.path[this.pathIndex].x - 5) {
                if(!this.boss) this.img.rotation = 3.14*2;
                this.position.x += this.slowFactor * this.speed * delta;
            } else{
                xdone = true;
            }
            if(this.position.y > this.path[this.pathIndex].y + 5) {
                if(!this.boss) this.img.rotation = (3*3.14) / 2;
                this.position.y -= this.slowFactor * this.speed * delta;
            }else if(this.position.y < this.path[this.pathIndex].y - 5) {
                this.position.y += this.slowFactor * this.speed * delta;
                if(!this.boss) this.img.rotation = 3.14 / 2;
            }else{
                ydone = true;
            }
            if(xdone && ydone){
                this.pathIndex++;
            }
        }

        terminate(){
            for(var i in this.particleEmitters){
                if(this.particleEmitters[i])this.particleEmitters[i].destroy();
            }
            $rootScope.$emit('deadEnemy', this);
            if(enemies.indexOf(this) !== -1) {
                let x = enemies.splice(enemies.indexOf(this),1);
            }

            explosionEmitters.push(ParticleFactory.createEmitter('critter1pieces', StateFactory.stages.play, ["core1", "wing1", "eye1", "ball1"]));
            explosionEmitters[explosionEmitters.length-1].updateOwnerPos(this.position.x, this.position.y);
            $rootScope.$emit("updateNumberOfEnemies");
            stage.removeChild(this.img);
            stage.removeChild(this.healthBar);
            stage.removeChild(this.imgContainer);

        }

        update(delta){
            this.moveTowards(delta);
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
                this.terminate();
            }
            if(this.poisoned) this.takeDamage(this.poisonDamage);
        }

        takeDamage(damage){
            this.health -= damage;
            var healthPercentage = this.health / this.maxHealth;
            this.healthBar.width = 40 * healthPercentage;

            if(!this.particleEmitters.damageSparks) this.particleEmitters.damageSparks = ParticleFactory.createEmitter('damageSparks', StateFactory.stages.play);

            if(this.health <= 0){
                explosionEmitters.push(ParticleFactory.createEmitter('critter1pieces', StateFactory.stages.play));
                explosionEmitters[explosionEmitters.length-1].updateOwnerPos(this.position.x, this.position.y);
                PlayerFactory.money += this.value;
                $rootScope.$digest();
                this.terminate();
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

    }

     class SmallBugRed  extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 5,
                speed: 128,
                health: 10,
                color: "red"
            });
        }
    }

    class SmallBugGreen  extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 5,
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
                value: 5,
                speed: 128,
                health: 10,
                color: "blue"
            });
        }
    }

    class SmallBugYellow  extends Enemy {
        constructor(opts) {
            super({
                img: '1',
                power: 2,
                path: opts.path,
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
                value: 5,
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
        console.log("Number of enemies", enemies.length);
        console.log("Enemies", enemies);
        for(let i = enemies.length -1; i >=0; i--){
            let enemy = enemies[i];
            enemy.terminate();       
        }
        // enemies.forEach((enemy) => {
        //     console.log("Each enemy",enemy);
        //     enemy.terminate();
        // });
        // // enemies = [];
    }
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
        updateAll
    };
});
