'use strict'
//FIXME
app.factory('EnemyFactory', function($rootScope, GameFactory, WaveFactory, PlayerFactory) {
    var enemies = [];

    class Enemy {
        constructor(opts) {
            if (opts) {
                if (opts.img) {
                    var array = [];
                    for(var i=1; i < 7; i++){
                        var img = PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-blue/" + i.toString() + ".png");
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
            this.value = 0;
            this.health = 10;
            this.speed = 128;
            this.radius = 10;
            this.path = opts.path;
            this.pathIndex = 0;
        }

        moveTowards(delta) {
            var xdone = false;
            var ydone = false;
            if(this.position.x > this.path[this.pathIndex].x + 5) {
                this.img.rotation = 3.14;
                this.position.x -= this.speed * delta;

            } else if(this.position.x < this.path[this.pathIndex].x - 5) {
                this.img.rotation = 3.14*2;
                this.position.x += this.speed * delta;
            } else{
                xdone = true;
            }
            if(this.position.y > this.path[this.pathIndex].y + 5) {
                this.img.rotation = (3*3.14) / 2;
                this.position.y -= this.speed * delta;
            }else if(this.position.y < this.path[this.pathIndex].y - 5) {
                this.position.y += this.speed * delta;
                this.img.rotation = 3.14 / 2;
            }else{
                ydone = true;
            }
            if(xdone && ydone){
                this.pathIndex++;
            }
        }

        terminate(){
            if(enemies.indexOf(this) !== -1) {
                var x = enemies.splice(enemies.indexOf(this),1);
            }
            GameFactory.stages.play.removeChild(this.img);
            if(enemies.length === 0 && GameFactory.launchCritters){
                if(WaveFactory.endOfWaves()) {
                    WaveFactory.setCurrentWave();
                    GameFactory.nextWave = true;
                } else {
                    GameFactory.wavesDone = true;
                }
                GameFactory.launchCritters = false;
            }
        }

        update(delta){
            this.moveTowards(delta);
            if(!this.path[this.pathIndex]) {
                PlayerFactory.health--;
                $rootScope.$digest();
                this.terminate();
            }
        }

        takeDamage(damage){
            this.health -= damage;
            if(this.health <= 0){
                $rootScope.$emit('deadEnemy', this);
                PlayerFactory.money += this.value;
                console.log(PlayerFactory.money, this.value);
                $rootScope.$digest();
                this.terminate();
            }
        }
    }

    class trojanHorse extends Enemy {
        constructor(opts) {
            super({img: '1', power: 2, path: opts.path});
            this.value = 5;
        }
    }

    var createEnemy = (type, path) => {

        let newEnemy;

        let enemyConstructor = enemiesConstructors[type];
        newEnemy = new enemyConstructor({path: path});
        enemies.push(newEnemy);

        return newEnemy;
    };

    var updateAll = function(delta){
        enemies.forEach(function(enemy){
            enemy.update(delta);
        });
    };


    // var terminateEnemy = (enemyObj) => {
    //     if(enemies.indexOf(enemyObj) !== -1) {
    //         var x = enemies.splice(enemies.indexOf(enemyObj),1);
    //         return x[0];
    //     }
    //  };

    var enemiesConstructors = {trojanHorse};

    //adWare, worm
    return {
        createEnemy,
        enemies,
        updateAll
    };
});
