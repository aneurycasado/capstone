'use strict'
//FIXME
app.factory('EnemyFactory', function() {
    class Enemy {
        constructor(opts) {

            if (opts) {
                if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-blue/1.png"));
                this.position = {x: opts.path[0].x, y: opts.path[0].y};
                this.img.position = this.position;
                if (opts.power) this.power = opts.power;
            }

            this.speed = 128;


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
                this.position.x -= this.speed * delta;
            } else if(this.position.x < this.path[this.pathIndex].x - 5) {
                this.position.x += this.speed * delta;
            } else{
                xdone = true;
            }

            if(this.position.y > this.path[this.pathIndex].y + 5) {
                this.position.y -= this.speed * delta;
            }else if(this.position.y < this.path[this.pathIndex].y - 5) {
                this.position.y += this.speed * delta;
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
