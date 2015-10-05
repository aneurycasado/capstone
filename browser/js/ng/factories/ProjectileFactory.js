app.factory("ProjectileFactory", function(StateFactory, ParticleFactory, EnemyFactory){

  var projectiles = [];

  class Projectile {
    constructor(opts){
          this.x = 0;
          this.y = 0;
          this.radius = 0;
          this.speed = 0;
          this.power = 5;
          for(var opt in opts){
            this[opt] = opts[opt];
          }
          // this.img.anchor.x = 0.5;
          // this.img.anchor.y = 0.5;
          // this.img.height = this.radius*2;
          // this.img.width = this.radius*2;
          projectiles.push(this);
          //StateFactory.stages.play.addChild(this.img);
      }

      terminate() {

          //StateFactory.stages.play.removeChild(this.img);
          this.particleEmitter.destroy();
          projectiles.splice(projectiles.indexOf(this), 1);
      }
  }

  class HomingProjectile extends Projectile {
      constructor(opts){
          super(opts);
          this.target = opts.enemy;
      }

      update() {
          if(checkCircleCollision(this, this.target)){
            console.log(this.power);
              this.target.takeDamage(this.power);
              this.terminate();
          }else{
              this.theta = (Math.atan((this.target.position.x - this.x) / (this.target.position.y - this.y)));
              this.xVel = this.speed*Math.sin(this.theta);
              this.yVel = this.speed*Math.cos(this.theta);
              if(this.y <= this.target.y) {
                this.x += this.xVel;
                this.y += this.yVel;
              }else{
                this.x -= this.xVel;
                this.y -= this.yVel;
              }
              this.particleEmitter.update(1);
              this.particleEmitter.updateOwnerPos(this.x, this.y);
          }
      }

  }

  class IceProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.slowSpeed = 0.5;
        this.slowDuration = 1000;
        this.particleEmitter = ParticleFactory.createEmitter('ice', StateFactory.stages.play);
        this.update();
      }

      terminate() {
          //StateFactory.stages.play.removeChild(this.img);
          this.slowEnemy();          
          this.particleEmitter.destroy();
          projectiles.splice(projectiles.indexOf(this), 1);
      }

      slowEnemy() {
        this.target.lastSlowed = Date.now();
        if(this.target.slowFactor > this.slowSpeed ) {
            this.target.slowFactor = this.slowSpeed;
            this.target.img.tint = 12168959;
        }
        window.setTimeout(function(){
            console.log(Date.now() - this.target.lastSlowed);
            if(Date.now() - this.target.lastSlowed >  this.slowDuration) {
              this.target.slowFactor = 1;
              this.target.img.tint = 16777215;
            }
        }.bind(this), this.slowDuration);
        
      }
  }

  class FireProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.particleEmitter = ParticleFactory.createEmitter('fire', StateFactory.stages.play);
        this.update();
      }
  }

  class PoisonProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.particleEmitter = ParticleFactory.createEmitter('poison', StateFactory.stages.play);
        this.update();
      }
  }

  class StraightProjectile extends Projectile{
    constructor(opts){
      super(opts);
      this.target = opts.enemy;
      this.theta = (Math.atan((this.target.position.x - this.x) / (this.target.position.y - this.y)));
      this.xVel = this.speed*Math.sin(this.theta);
      this.yVel = this.speed*Math.cos(this.theta);
      if(this.y > this.target.y) {
        this.xVel *= -1;
        this.yVel *= -1;
      }
      this.particleEmitter = ParticleFactory.createEmitter('poison', StateFactory.stages.play);
      this.update();
    }

    update(){
        this.x += this.xVel;
        this.y += this.yVel;
        this.particleEmitter.update(1);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
        for(var i = 0; i < EnemyFactory.enemies.length; i++)
            if(checkCircleCollision(this, EnemyFactory.enemies[i])){
              EnemyFactory.enemies[i].takeDamage(this.power);
              this.terminate();
              break;
            }
    }

  }

  var checkCircleCollision = function(circle1, circle2){
      circle2.x = circle2.position.x;
      circle2.y = circle2.position.y;
      var dx = circle1.x - circle2.x;
      var dy = circle1.y - circle2.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      return (distance < circle1.radius + circle2.radius);
  };


  var updateAll = function(){
      projectiles.forEach(function(projectile){
          projectile.update();
      });
  };

  return {
    Projectile,
    HomingProjectile,
    FireProjectile,
    PoisonProjectile,
    IceProjectile,
    StraightProjectile,
    updateAll
  };
});
