'use strict'
//FIXME
app.factory('EnemyFactory', function($rootScope, ParticleFactory, StateFactory, PlayerFactory) {

    let explosionEmitters = [];
    let enemies = [];
    let stage = new PIXI.Stage();
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

            explosionEmitters.push(ParticleFactory.createEmitter('critter1pieces', StateFactory.stages.play));
            explosionEmitters[explosionEmitters.length-1].updateOwnerPos(this.position.x, this.position.y);

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
                PlayerFactory.money += this.value;
                $rootScope.$digest();
                this.terminate();
            }
        }
    }

    class trojanHorse extends Enemy {
        constructor(opts) {
            super({
                img: '1', 
                power: 2, 
                path: opts.path,
                value: 5,
                speed: 128,
                health: 10
            });
        }
    }

    class bigBug extends Enemy {
        constructor(opts) {
            super({
                img: '2', 
                power: 2, 
                path: opts.path,
                value: 5,
                speed: 90,
                health: 30
            });
        }
    }

    class bossBug extends Enemy {
        constructor(opts) {
            super({
                img: '3', 
                power: 2, 
                path: opts.path,
                value: 5,
                speed: 100,
                health: 100
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

        console.log(explosionEmitters);

        explosionEmitters.forEach((emitter) => {
            emitter.update(delta);
        });
    };

    let enemiesConstructors = {trojanHorse,bigBug,bossBug};

    //adWare, worm
    return {
        stage,
        createEnemy,
        enemies,
        updateAll
    };
});
