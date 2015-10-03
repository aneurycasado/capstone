'use strict'

app.factory('EnemyFactory', function() {
    class Enemy {
        constructor(opts) {
            console.log("OPTS", opts.path);

            if (opts) {
                if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/creep/creep-" + opts.img + "-blue/1.png"));
                this.position = {x: opts.path[0].x, y: opts.path[0].y};
                this.img.position = this.position;
                if (opts.power) this.power = opts.power;
            }

            this.speed = .1;


            this.path = opts.path;
            this.pathIndex = 0;



        }
        moveTowards(modifier = 2) {

            var xdone = false;
            var ydone = false;

            if(this.position.x > this.path[this.pathIndex].x + 5){
                this.position.x -= this.speed * modifier;
            }else if(this.position.x < this.path[this.pathIndex].x - 5){
                this.position.x += this.speed * modifier;
            }else{
                xdone = true;
            }

            if(this.position.y > this.path[this.pathIndex].y + 5){
                this.position.y -= this.speed * modifier;
            }else if(this.position.y < this.path[this.pathIndex].y - 5){
                this.position.y += this.speed * modifier;
            }else{
                ydone = true;
            }

            if(xdone && ydone){
                this.pathIndex++;
            }
        }
    }

    class trojanHorse extends Enemy {
        constructor(path) {
            super({img: '1', power: 2, path: path});
        }
    }

    var createEnemy = (type, path) => {

        let newEnemy;

        let enemyConstructor = enemiesConstructors[type];
        newEnemy = new enemyConstructor(path);
        enemies.push(newEnemy);

        return newEnemy;


    };


    var enemiesConstructors = {trojanHorse};

    //adWare, worm
    var enemies = [];
    return {
        createEnemy,
        enemies
    };
});
