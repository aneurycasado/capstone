app.factory("ProjectileFactory", function(StateFactory, ParticleFactory, EnemyFactory){

  let projectiles = [];

  let stage = new PIXI.Stage();

  class Projectile {
    constructor(opts){
          this.x = 0;
          this.y = 0;
          this.radius = 0;
          this.speed = 1;
          this.power = 5;
          for(let opt in opts){
            this[opt] = opts[opt];
          }
          projectiles.push(this);
          window.setTimeout(function(){
            if(projectiles.indexOf(this) !== -1) this.terminate();
          }.bind(this), 30000);
      }

      terminate() {
          this.particleEmitter.destroy();
          projectiles.splice(projectiles.indexOf(this), 1);
      }
  }

   class HomingProjectile extends Projectile {
     constructor(opts){
         super(opts);
         this.target = opts.enemy;
     }

     update(delta) {
         if(checkCircleCollision(this, this.target)){
             this.target.takeDamage(this.power);
             if(this.specialEffect) this.specialEffect();
             this.terminate();
         }else{
             this.theta = (Math.atan((this.target.position.x - this.x) / (this.target.position.y - this.y)));
             this.xVel = this.speed*Math.sin(this.theta) * delta;
             this.yVel = this.speed*Math.cos(this.theta) * delta;
             if(this.y <= this.target.y) {
               this.x += this.xVel;
               this.y += this.yVel;
             }else{
               this.x -= this.xVel;
               this.y -= this.yVel;
             }
             this.particleEmitter.update(delta);
             this.particleEmitter.updateOwnerPos(this.x, this.y);
         }
     }

    }

  class StraightProjectile extends Projectile{
    constructor(opts){
      super(opts);
      this.target = opts.enemy;
      this.theta = (Math.atan((this.target.position.x - this.x) / (this.target.position.y - this.y)));
      this.xVel = this.speed*Math.sin(this.theta);
      this.yVel = this.speed*Math.cos(this.theta);
      if(this.y > this.target.position.y) {
        this.xVel *= -1;
        this.yVel *= -1;
      }
    }

    update(delta){
        this.x += this.xVel * delta;
        this.y += this.yVel * delta;
        this.particleEmitter.update(delta);

        this.particleEmitter.updateOwnerPos(this.x, this.y);
        for(let i = 0; i < EnemyFactory.enemies.length; i++)
            if(checkCircleCollision(this, EnemyFactory.enemies[i])){
              EnemyFactory.enemies[i].takeDamage(this.power);
              this.terminate();
              break;
            }

        if(this.extendUpdate) this.extendUpdate(delta);

    }

  }

  class ThunderBallProjectile extends StraightProjectile{
    constructor(opts){
      super(opts);
      this.particleEmitter = ParticleFactory.createEmitter('lightningBall', StateFactory.stages.play);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
    }
  }

  class IceProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.slowSpeed = 0.5;
        this.slowDuration = 1000;
        this.particleEmitter = ParticleFactory.createEmitter('ice', StateFactory.stages.play);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect() {
        this.target.lastSlowed = Date.now();
        if(this.target.slowFactor > this.slowSpeed ) {
            this.target.slowFactor = this.slowSpeed;
            this.target.img.tint = 12168959;
        }
        window.setTimeout(function(){
            if(Date.now() - this.target.lastSlowed >=  this.slowDuration) {
              this.target.slowFactor = 1;
              this.target.img.tint = 16777215;
            }
        }.bind(this), this.slowDuration);

      }
  }

  class FirePuddle extends Projectile{
    constructor(opts){
      super(opts);
      this.power = 0.2;
      this.radius = 20;
      this.particleEmitter = ParticleFactory.createEmitter('fire', StateFactory.stages.play);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
      window.setTimeout(function(){
        if(projectiles.indexOf(this) !== -1) this.terminate();
      }.bind(this), 3000);
    }

    update(delta){
      var fire = this;
      EnemyFactory.enemies.forEach(function(enemy){
        if(checkCircleCollision(fire, enemy)){
           enemy.takeDamage(fire.power);
        }
      });
      this.particleEmitter.update(delta);
    }

  }

  class FireProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.particleEmitter = ParticleFactory.createEmitter('fire2', StateFactory.stages.play);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect(){
        new FirePuddle({
          x: this.x,
          y: this.y
        });
      }
  }

  class MeteorProjectile extends StraightProjectile{
      constructor(opts){
        super(opts);

       
        this.particleEmitter = ParticleFactory.createEmitter('meteor', StateFactory.stages.play);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
        
        this.extraImage = new PIXI.Sprite(PIXI.Texture.fromImage("/images/particles/meteor.png"));
        this.extraImage.anchor.x = .5;
        this.extraImage.anchor.y = .5;
        stage.addChild(this.extraImage);


      }

      extendUpdate(delta){
        this.extraImage.position.x = this.x;
        this.extraImage.position.y = this.y;

      }

      specialEffect(){
        stage.removeChild(this.extraImage);

        new FirePuddle({
          x: this.x,
          y: this.y
        });
      }
  }

  class PoisonProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.poisonDamage = 0.1;
        this.particleEmitter = ParticleFactory.createEmitter('poison', StateFactory.stages.play);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect() {
        this.target.poisoned = true;
        this.target.poisonDamage = this.poisonDamage;
        if(!this.target.particleEmitters.poison){
          this.target.particleEmitters.poison = ParticleFactory.createEmitter('poison', StateFactory.stages.play);
        }
      }
  }



  let checkCircleCollision = (circle1, circle2) => {
      circle2.x = circle2.position.x;
      circle2.y = circle2.position.y;
      let dx = circle1.x - circle2.x;
      let dy = circle1.y - circle2.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      return (distance < circle1.radius + circle2.radius);
  };


  let updateAll = (delta) => {
      projectiles.forEach((projectile) => {
          projectile.update(delta);
      });
  };

  return {
    stage,
    Projectile,
    HomingProjectile,
    FireProjectile,
    PoisonProjectile,
    IceProjectile,
    StraightProjectile,
    MeteorProjectile,
    ThunderBallProjectile,
    updateAll
  };
});
