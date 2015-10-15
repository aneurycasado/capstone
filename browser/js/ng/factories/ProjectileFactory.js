app.factory("ProjectileFactory", function(LightningFactory, StateFactory, ParticleFactory, EnemyFactory){
  let projectiles = [];

  let stage = new PIXI.Stage();

  const checkCircleCollision = (circle1, circle2) => {
      circle2.x = circle2.position.x;
      circle2.y = circle2.position.y;
      let dx = circle1.x - circle2.x;
      let dy = circle1.y - circle2.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      return (distance < circle1.radius + circle2.radius);
  };

  const outOfBounds = (mod) => {
    return this.x - mod > StateFactory.width || this.x < -mod || this.y - mod > StateFactory.height || this.y < -mod;
  }
  
  const outOfTime = (time) => {
    if(this.duration) time = this.duration;
    return Date.now() > this.startTime + time;
  }

  const invincibleConditions = () => {
       return outOfBounds.call(this, 200) && outOfTime.call(this, 3500);
  };

  class Projectile {
    constructor(opts){
          this.x = 0;
          this.y = 0;
          this.radius = 3;
          this.speed = 1;
          for(let opt in opts){
            this[opt] = opts[opt];
          }
          projectiles.push(this);
          window.setTimeout(() => {
            if(this && !this.invincible){
              this.terminate();
            } 
          }, 10000);
      }

      terminate() {
          if(this.circle) stage.removeChild(this.circle);
          if(this.particleEmitter){
            this.particleEmitter.destroy();
            this.particleEmitter = null;
          }
          if(projectiles.indexOf(this) !== -1){
            projectiles.splice(projectiles.indexOf(this), 1);
          }
      }

      update(){
            // if(!this.circle){
            //     this.circle = new PIXI.Graphics();
            //     this.circle.beginFill(0xFF0000, 0.4);
            //     this.circle.lineStyle(2, 0xFF0000);
            //     this.circle.drawCircle(this.x, this.y, this.radius);
            //     stage.addChild(this.circle);
            // }else{
            //     stage.removeChild(this.circle);
            //     this.circle = new PIXI.Graphics();
            //     this.circle.beginFill(0xFF0000, 0.4);
            //     this.circle.lineStyle(2, 0xFF0000);
            //     this.circle.drawCircle(this.x, this.y, this.radius);
            //     stage.addChild(this.circle);
            // }
      }
  }

   class HomingProjectile extends Projectile {
     constructor(opts){
         super(opts);
         this.target = opts.enemy;
     }

     update(delta) {
         super.update(delta);

          this.particleEmitter.update(delta);
          this.particleEmitter.updateOwnerPos(this.x, this.y);
         if(checkCircleCollision(this, this.target)){
             this.target.takeDamage(this.power, this.tower);
             if(this.specialEffect) this.specialEffect();
              if(!this.invincible) this.terminate();
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

           
         }
        if(this.invincible && invincibleConditions.call(this)) this.terminate();

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
        super.update(delta);

        if(this.particleEmitter.noSloMo){
          delta = delta*StateFactory.sloMoMod;
        }

        this.x += this.xVel * delta;
        this.y += this.yVel * delta;
        this.particleEmitter.update(delta);

        this.particleEmitter.updateOwnerPos(this.x, this.y);
        for(let i = 0; i < EnemyFactory.enemies.length; i++)
            if(checkCircleCollision(this, EnemyFactory.enemies[i])){
              EnemyFactory.enemies[i].takeDamage(this.power, this.tower);
              if(this.specialEffect) this.specialEffect();
              if(!this.invincible) this.terminate();
              break;
            }

        if(this.invincible && invincibleConditions.call(this)) this.terminate();

    }

  }

  class ThunderBallProjectile extends StraightProjectile{
    constructor(opts){
      super(opts);
      this.particleEmitter = ParticleFactory.createEmitter('lightningBall', stage);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
      window.setTimeout(() => this.terminate(), 3000);
    }
  }

  class ToxicProjectile extends HomingProjectile{
    constructor(opts){
      super(opts);
      this.invincible = true;
      this.startTime = Date.now();

      this.particleEmitter = ParticleFactory.createEmitter('toxic', stage);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
    }
  }

  class IceProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.slowSpeed = 0.5;
        this.slowDuration = 5000;
        this.particleEmitter = ParticleFactory.createEmitter('ice', stage);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect() {
        this.target.lastSlowed = Date.now();
        if(this.target.slowFactor > this.slowSpeed ) {
            this.target.slowFactor = this.slowSpeed;
            this.target.img.tint = 12168959;
        }
        window.setTimeout(() => {
            if(Date.now() - this.target.lastSlowed >= this.slowDuration) {
              this.target.slowFactor = 1;
              this.target.img.tint = 16777215;
            }
        },this.slowDuration);

      }
  }

  class BlizzardProjectile extends StraightProjectile{
      constructor(opts){
        super(opts);
        this.slowSpeed = 0.4;
        this.radius = 200;
        this.slowDuration = 1000;
        this.particleEmitter = ParticleFactory.createEmitter('blizzard', stage);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
        this.particleEmitter.noSloMo = true;
        this.invincible = true;
        this.startTime = Date.now();
        this.duration = 100000;
        window.setTimeout(() => {
            if(this){
              this.terminate();
            } 
        }, 5000);
      }

      slowEnemy(enemy) {
        enemy.lastSlowed = Date.now();
        if(enemy.slowFactor > this.slowSpeed ) {
            enemy.slowFactor = this.slowSpeed;
            enemy.img.tint = 12168959;
        }
        window.setTimeout(() => {
          console.log(Date.now() - enemy.lastSlowed, this.slowDuration);  
            if(Date.now() - enemy.lastSlowed >= this.slowDuration) {
              enemy.slowFactor = 1;
              enemy.img.tint = 16777215;
            }
        },this.slowDuration);
      }

      update(delta){
          super.update(delta);
          var ice = this;
          EnemyFactory.enemies.forEach(function(enemy){
            if(checkCircleCollision(ice, enemy)){
              ice.slowEnemy(enemy);
            }
          });
          this.particleEmitter.update(delta);
      }
  }

  class FirePuddle extends Projectile{
    constructor(opts){
      super(opts);
      console.log(this.tower, opts)
      this.power = 0.3;
      this.radius = 30;
      this.particleEmitter = ParticleFactory.createEmitter('fire', stage);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
      window.setTimeout(function(){
        if(projectiles.indexOf(this) !== -1) this.terminate();
      }.bind(this), 3000);
    }

    update(delta){
      var fire = this;
      EnemyFactory.enemies.forEach(function(enemy){
        if(checkCircleCollision(fire, enemy)){
           enemy.takeDamage(fire.power, fire.tower);
        }
      });
      this.particleEmitter.update(delta);
    }

  }

  class IcePuddle extends Projectile{
    constructor(opts){
      super(opts);
      this.slowSpeed = 0.3;
      this.slowDuration = 2000;
      this.particleEmitter = ParticleFactory.createEmitter('cold', stage);
      this.particleEmitter.updateOwnerPos(this.x, this.y);
      this.radius = 30;
      window.setTimeout(() => {
        if(projectiles.indexOf(this) !== -1) this.terminate();
      }, 2000);
    }

    update(delta){
      var ice = this;
      EnemyFactory.enemies.forEach(function(enemy){
        if(checkCircleCollision(ice, enemy)){
            enemy.lastSlowed = Date.now();
            if(enemy.slowFactor > ice.slowSpeed ) {
                enemy.slowFactor = ice.slowSpeed;
                enemy.img.tint = 12168959;
            }
            window.setTimeout(() => {
                if(Date.now() - enemy.lastSlowed >= ice.slowDuration) {
                  enemy.slowFactor = 1;
                  enemy.img.tint = 16777215;
                }
            },ice.slowDuration);
        }
      });
      this.particleEmitter.update(delta);
    }

  }

  class FireProjectile extends HomingProjectile{
      constructor(opts){
        super(opts);
        this.particleEmitter = ParticleFactory.createEmitter('fire', stage);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect(){
        new FirePuddle({
          x: this.x,
          y: this.y,
          tower: this.tower
        });
      }
  }

  class MeteorProjectile extends StraightProjectile{
      constructor(opts){
        super(opts);


        this.particleEmitter = ParticleFactory.createEmitter('meteor', stage);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
        this.particleEmitter.noSloMo = true;

        this.extraImage = new PIXI.Sprite(PIXI.Texture.fromImage("/images/particles/meteor.png"));
        this.extraImage.anchor.x = .5;
        this.extraImage.anchor.y = .5;
        stage.addChild(this.extraImage);
        this.invincible = true;
        this.startTime = Date.now();


      }

      update(delta){
        super.update(delta);

        this.extraImage.position.x = this.x;
        this.extraImage.position.y = this.y;
        this.extraImage.rotation = this.extraImage.rotation + (3 * delta);

      }

      specialEffect(){
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
        this.particleEmitter = ParticleFactory.createEmitter('poison', stage);
        this.particleEmitter.updateOwnerPos(this.x, this.y);
      }

      specialEffect() {
        this.target.poisonedBy = this.tower;
        this.target.poisoned = true;
        this.target.poisonDamage = this.poisonDamage;
        if(!this.target.particleEmitters.poison){
          this.target.particleEmitters.poison = ParticleFactory.createEmitter('poison', stage);
        }
      }
  }


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
    BlizzardProjectile,
    ToxicProjectile,
    IcePuddle,
    updateAll
  };
});
