'use strict'
//FIXME
app.factory('EnemyFactory', function($rootScope, ParticleFactory, StateFactory, PlayerFactory) {

    let enemies = [];
    let stage = new PIXI.Stage();
    class Enemy {
        constructor(opts) {
            this.particleEmitters = {};
            if (opts) {
                if (opts.img) {
                    let array = [];
                    let end;
                    if(opts.img === 1) end = 7;
                    else end = 5;
                    for(let i=1; i < end; i++){
                        let img = PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-blue/" + i.toString() + ".png");
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
            this.slowFactor = 1;
            this.value = 0;

            this.radius = 10;
            this.path = opts.path;
            this.pathIndex = 0;
        }

        moveTowards(delta) {
            let xdone = false;
            let ydone = false;
            if(this.position.x > this.path[this.pathIndex].x + 5) {
                this.img.rotation = 3.14;
                this.position.x -= this.slowFactor * this.speed * delta;

            } else if(this.position.x < this.path[this.pathIndex].x - 5) {
                this.img.rotation = 3.14*2;
                this.position.x += this.slowFactor * this.speed * delta;
            } else{
                xdone = true;
            }
            if(this.position.y > this.path[this.pathIndex].y + 5) {
                this.img.rotation = (3*3.14) / 2;
                this.position.y -= this.slowFactor * this.speed * delta;
            }else if(this.position.y < this.path[this.pathIndex].y - 5) {
                this.position.y += this.slowFactor * this.speed * delta;
                this.img.rotation = 3.14 / 2;
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
            stage.removeChild(this.img);
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
            if(this.onFire) this.takeDamage(this.fireDamage);
        }

        takeDamage(damage){
            this.health -= damage;

            if(!this.particleEmitters.damageSparks) this.particleEmitters.damageSparks = ParticleFactory.createEmitter('damageSparks', StateFactory.stages.play);

            if(this.health <= 0){
                PlayerFactory.money += this.value;
                $rootScope.$digest();
                this.terminate();
            }
        }
    }

    class trojanHorse extends Enemy {
        constructor(opts) {
            super({img: '1', power: 2, path: opts.path});
            this.value = 5;
            this.speed = 128;
            this.health = 10;
        }
    }

    class bigBug extends Enemy {
        constructor(opts) {
            super({img: '2', power: 2, path: opts.path});
            this.value = 5;
            this.speed = 90;
            this.health = 30;
        }
    }

    class bossBug extends Enemy {
        constructor(opts) {
            super({img: '3', power: 2, path: opts.path});
            this.value = 5;
            this.speed = 100;
            this.health = 100;
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
    };

    let reset = () => {
        stage.removeChildren();
        //enemies = [];
    }
    let enemiesConstructors = {trojanHorse,bigBug,bossBug};
    //adWare, worm
    return {
        reset,
        stage,
        createEnemy,
        enemies,
        updateAll
    };
});
