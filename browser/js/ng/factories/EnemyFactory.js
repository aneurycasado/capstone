'use strict'
//FIXME
app.factory('EnemyFactory', function() {
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
                this.img.pivot.x = .5;
                this.img.pivot.y = .5;
                this.img.anchor.x  = .5;
                this.img.anchor.y = .5;
                this.img.animationSpeed = 0.5;
                this.img.play();
                if (opts.power) this.power = opts.power;
            }
            this.speed = 128;
            this.radius = 10;
            this.path = opts.path;
            this.pathIndex = 0;
        }
        moveTowards(delta) {
            var xdone = false;
            var ydone = false;
            if(!this.path[this.pathIndex]) {
                return terminateEnemy(this);
            }
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
                this.img.rotation = (3*3.14) / 2; ;
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
    }

    class trojanHorse extends Enemy {
        constructor(opts) {
            super({img: '1', power: 2, path: opts.path});
        }
    }

    var enemies = [];
    var createEnemy = (type, path) => {

        let newEnemy;

        let enemyConstructor = enemiesConstructors[type];
        console.log("Type enemy, ",type);
        newEnemy = new enemyConstructor({path: path});
        enemies.push(newEnemy);

        return newEnemy;
    };

    var terminateEnemy = (enemyObj) => {
        if(enemies.indexOf(enemyObj) !== -1) {
            var x = enemies.splice(enemies.indexOf(enemyObj),1);
            return x[0];
        }
     };

    var enemiesConstructors = {trojanHorse};

    //adWare, worm
    return {
        createEnemy,
        enemies,
        terminateEnemy
    };
});