app.factory('WeaponFactory', function(ProjectileFactory, ParticleFactory, EnemyFactory, StateFactory, LightningFactory) {

  let towerStage = StateFactory.stages.towers;
  class Weapon {
    constructor(tower, power, range, name, effect) {
      this.tower = tower;
      this.power = power;
      this.range = range;
      this.name = name;
      this.effect = effect;
    }
    shoot(enemy, projectile, options){
        this.tower.img.play();
        options.power = this.power;
        options.x = this.tower.img.position.x;
        options.y = this.tower.img.position.y;
        options.enemy = enemy;
        new ProjectileFactory[projectile](options);
    }
  }

  class FlameWeapon extends Weapon {
    constructor(tower) {
      super(tower, .5, 150, "Flame", 'Fill in')
      this.flameCircleCenters = [];
      this.numOfFlameCircles = 10;
      this.flameCircleRadius = 20;
      this.circles = [];
      this.reloadTime = 0;
    }
    // update(delta) {
    //   this.tower.acquireTarget();
    //   if(!this.tower.target) {
    //     this.tower.img.stop();
    //   } else {
    //     if(this.tower.isEnemyInRange(this.tower.target)) {
    //       this.tower.target = null;
    //       this.tower.particleEmitter.destroy();
    //       this.tower.particleEmittter = null;
    //     } else {
    //       this.shoot()
    //       this.particleEmitter.update(delta);
    //     }
    //   }
    // }
    shoot() {
      // if(!this.tower.particleEmitter) {
      //   this.tower.particleEmitter = new ParticleFactory.createEmitter('flame', towerStage);
      //   // this.calcRotation();
      //   this.tower.particleEmitter.updateOwnerPos(this.tower.img.position.x, this.tower.img.position.y);
      // }
      this.calcRotation();
      this.calcFlameCircleCenters();
      this.dealDamage();
    }

    dealDamage(){
       var self = this;
       var inFire = false;
       EnemyFactory.enemies.forEach(function(enemy) {
           self.flameCircleCenters.forEach(function(flameCircleCenter){
               if(self.checkRadius(flameCircleCenter, enemy)) {
                   inFire = true;
               }
           });
           if(inFire) enemy.takeDamage(self.power, self.tower);
           inFire = false;
       });
    }
    calcRotation() {
       this.tower.particleEmitter.rotation = (-57.3 * (Math.atan2((this.tower.target.imgContainer.position.x - this.tower.img.position.x) , (this.tower.target.imgContainer.position.y - this.tower.img.position.y))) + 180);
    }
    checkRadius(center, enemy) {
         let dx = center.x - enemy.imgContainer.position.x;
         let dy = center.y - enemy.imgContainer.position.y;
         let distance = Math.sqrt(dx * dx + dy * dy);
        // if(center.x - enemy.imgContainer.position.x < 100){
        //   console.log(distance, this.flameCircleRadius + enemy.radius);
        //   console.log(center, enemy);
        // }
         return (distance < this.flameCircleRadius + enemy.radius);
    }
    calcFlameCircleCenters(){
      //console.log(this.tower.target.imgContainer.position.x, )
       var xDiff = this.tower.target.imgContainer.position.x - this.tower.img.position.x;
       var yDiff = this.tower.target.imgContainer.position.y - this.tower.img.position.y;
       var theta = Math.atan2(xDiff, yDiff);
       var farthestPoint = {
           x: this.range*Math.sin(theta),
           y: this.range*Math.cos(theta),
       };
       for(var i = 1; i <= this.numOfFlameCircles; i++){
           this.flameCircleCenters[i] = {
               x: (farthestPoint.x / this.numOfFlameCircles) * i + this.tower.img.position.x,
               y: (farthestPoint.y / this.numOfFlameCircles) * i + this.tower.img.position.y
           };
           // if(!this.circles[i]){
           //  this.circles[i] = new PIXI.Graphics();
           //  this.circles[i].beginFill(0xFF0000, 0.4);
           //  this.circles[i].lineStyle(2, 0xFF0000);
           //  towerStage.addChild(this.circles[i]);
           // }else{
           //      towerStage.removeChild(this.circles[i]);
           //      this.circles[i] = new PIXI.Graphics();
           //      this.circles[i].beginFill(0xFF0000, 0.4);
           //      this.circles[i].lineStyle(2, 0xFF0000);
           //      this.circles[i].drawCircle(this.flameCircleCenters[i].x, this.flameCircleCenters[i].y, this.flameCircleRadius);
           //      towerStage.addChild(this.circles[i]);
           // }
       }
    }
  }
  class FireWeapon extends Weapon {
    constructor(tower) {
      super(tower, 3, 200, "Fire", "Fill in")
      this.reloadTime = 2000;
      console.log('range', this.range);
    }
    shoot(enemy){
      super.shoot(enemy, 'FireProjectile', {speed: 200, radius: 0, tower: this.tower});
    }
  }

  class ThunderWeapon extends Weapon {
    constructor(tower) {
      super(tower, 30, 300, "Thunder", "Fill in")
      this.reloadTime = 2000;
    }
    shoot(enemy){
      super.shoot(enemy, 'ThunderBallProjectile', {
          power: this.power, 
          speed: 4000, 
          radius: 14,
          tower: this.tower
        });
    }
  }

  class ZapWeapon extends Weapon {
    constructor(tower) {
      super(tower, 15, 800, "Thunder", "Fill in")
      this.reloadTime = 2100;
    }
    shoot(enemy){

      var start = new LightningFactory.Yals.Vector2D(this.tower.img.position.x, this.tower.img.position.y);
      var end = new LightningFactory.Yals.Vector2D(enemy.position.x, enemy.position.y);

      lightnings.push( new LightningFactory.BranchLightning(start,end, '#FFFFFF', 1, .2) );

      enemy.takeDamage(this.power, this.tower);
    }
  }

  class PoisonWeapon extends Weapon {
    constructor(tower) {
      super(tower, 4, 200, 'Poison', 'Fill in');
      this.reloadTime = 4000;
    }
    shoot(enemy) {
      super.shoot(enemy, 'PoisonProjectile', {speed: 100, radius: 8, tower: this.tower})
    }
  }

  class GasWeapon extends Weapon {
    constructor(tower) {
        super(tower, 0.1, 100, 'Gas', 'Fill in');
        this.reloadTime = 5000;
        this.power = 0.1;
    }

    shoot(enemy){
        var tower = this.tower;
        var weapon = this;
        tower.img.play();
        tower.particleEmitter = ParticleFactory.createEmitter('gas', towerStage);
        tower.particleEmitter.updateOwnerPos(tower.img.position.x, tower.img.position.y);
        EnemyFactory.enemies.forEach(function(enemy){
            if(tower.isEnemyInRange(enemy)){
                enemy.poisoned = true;
                enemy.poisonDamage = weapon.power;
                enemy.poisonedBy = tower;
                if(!enemy.particleEmitters.poison){
                    enemy.particleEmitters.poison = ParticleFactory.createEmitter('poison', towerStage);
                }
            }
        });
    }
  }

  class IceWeapon extends Weapon {
    constructor(tower) {
      super(tower, 4, 200, 'Ice', 'Fill In');
      this.reloadTime = 800;
    }
    shoot(enemy) {
      super.shoot(enemy, 'IceProjectile', {speed: 200, radius: 8, tower: this.tower});
    }
  }

  class ToxicWeapon extends Weapon {
    constructor(tower) {
      super(tower, 4, 200, 'Toxic', 'Fill In');
      this.reloadTime = 400;
    }
    shoot(enemy) {
      super.shoot(enemy, 'ToxicProjectile', {speed: 30, radius: 8, tower: this.tower})
    }
  }

  class MeteorWeapon extends Weapon {
    constructor(tower) {
      super(tower, 10, null, 'Meteor', 'Fill in');
      this.sloMoTime = 3500;
    }
    shoot(enemy){
        this.tower.img.play();
        StateFactory.setTimeout2(function() {
          new ProjectileFactory.MeteorProjectile({power: this.power, x: enemy.position.x, y: -50, speed: 300, radius: 50, enemy: enemy, tower: this.tower});
        }.bind(this), 300)
        StateFactory.setTimeout2(function() {
          new ProjectileFactory.MeteorProjectile({power: this.power, x: enemy.position.x, y: -50, speed: 300, radius: 50, enemy: enemy, tower: this.tower});
        }.bind(this), 900)

        StateFactory.setTimeout2(function() {
          new ProjectileFactory.MeteorProjectile({power: this.power, x: enemy.position.x, y: -50, speed: 300, radius: 50, enemy: enemy, tower: this.tower});
        }.bind(this), 1500)

        StateFactory.sloMo = true;
        StateFactory.setTimeout2(function() {
          StateFactory.sloMo = false;
        }, this.sloMoTime);

    }
  }


  class BlizzardWeapon extends Weapon {
    constructor(tower) {
        super(tower, .0001, null, 'Blizzard', 'Fill in');
        this.ultimate = true;
        this.sloMoTime = 5000;
        this.reloadTime = 5000;
    }

    shoot(enemy){
        this.tower.img.play();
        new ProjectileFactory.BlizzardProjectile({
            power: this.power,
            x: this.tower.img.position.x,
            y: this.tower.img.position.y,
            speed: 0,
            radius: 200,
            enemy: enemy,
            tower: this.tower
        });

        StateFactory.sloMo = true;
        StateFactory.setTimeout2(function() {
            StateFactory.sloMo = false;
        }, this.sloMoTime);
    }
  }

  class LightningWeapon extends Weapon {
    constructor(tower) {
        super(tower, 1, null, 'Lightning', 'Fill in');
        this.ultimate = true;
        this.sloMoTime = 400;

    }

    shoot(enemy) {
        this.tower.img.play();

        StateFactory.setTimeout2(function(){
            var start = new LightningFactory.Yals.Vector2D(enemy.position.x, -100);
            var end = new LightningFactory.Yals.Vector2D(enemy.position.x, enemy.position.y);

            lightnings.push( new LightningFactory.BranchLightning(start,end, '#FFFFFF', 6, .03) );
            enemy.terminate(true);

        }.bind(this), 250);

        StateFactory.sloMo = true;
        StateFactory.setTimeout2(function() {
            StateFactory.sloMo = false;
        }, this.sloMoTime);

    }

  }

  class ColdWeapon extends Weapon {
    constructor(tower) {
      super(tower, 4, 200, 'Cold', 'Fill In');
      this.reloadTime = 15000;
    }
    shoot(enemy) {
      new ProjectileFactory.IcePuddle({
        x: enemy.imgContainer.position.x,
        y: enemy.imgContainer.position.y
      });
    }
  }

  let lightnings = [];

  let updateLightnings = function(){

      LightningFactory.ctx.clearRect(0, 0, LightningFactory.scene.width, LightningFactory.scene.width);
      lightnings = lightnings.filter(function(branch){

          if(!branch.complete){
              $(StateFactory.renderer.view).css({'z-index' : '1'})
              $(LightningFactory.scene.canvasElement).css({'z-index' : '2'});

              branch.update();
              branch.render(LightningFactory.ctx);
              return true;
          }else return false;

      });

  }

  return {
    FlameWeapon,
    ThunderWeapon,
    PoisonWeapon,
    FireWeapon,
    IceWeapon,
    MeteorWeapon,
    BlizzardWeapon,
    LightningWeapon,
    ToxicWeapon,
    GasWeapon,
    ZapWeapon,
    ColdWeapon,
    updateLightnings,
  };
});
