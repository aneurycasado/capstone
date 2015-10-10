app.factory('WeaponFactory', function(ProjectileFactory, ParticleFactory, EnemyFactory) {
  class Weapon {
    constructor(tower, power, range, price, name, effect) {
      this.tower = tower;
      this.power = power;
      this.range = range;
      this.price = price;
      this.name = name;
      this.effect = effect;
    }
    shoot(enemy, projectile, options){
        this.tower.img.play();
        options.x = this.tower.img.position.x;
        options.y = this.tower.img.position.y;
        options.enemy = enemy;
        new ProjectileFactory[projectile](options);
    }
  }

  class FlameWeapon extends Weapon {
    constructor(tower) {
      super(tower, 0.2, 150, 50, "Flame", 'Fill in')
      this.flameCircleCenters = [];
      this.numOfFlameCircles = 10;
      this.flameCircleRadius = 20;
      this.circles = [];
    }
    update(delta) {
      this.tower.acquireTarget();
      if(!this.tower.target) {
        this.tower.img.stop();
      } else {
        if(this.tower.isEnemyInRange(this.tower.target)) {
          this.tower.target = null;
          this.particleEmitter.destroy();
          this.particleEmittter = null;
        } else {
          this.shoot()
          this.particleEmitter.update(delta);
        }
      }
    }
    shoot() {
      if(!this.particleEmitter) {
        this.particleEmitter = new ParticleFactory.createEmitter('flame', stage);
        // this.calcRotation();
        this.particleEmitter.updateOwnerPos(this.tower.img.position.x, this.tower.img.position.y);
      }
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
           if(inFire) enemy.takeDamage(self.power);
           inFire = false;
       });
    }
    calcRotation() {
       this.particleEmitter.rotation = (-57.3 * (Math.atan2((this.tower.target.imgContainer.position.x - this.img.position.x) , (this.target.imgContainer.position.y - this.img.position.y))) + 180);
    }
    checkRadius(center, enemy) {
         let dx = center.x - enemy.img.position.x;
         let dy = center.y - enemy.img.position.y;
         let distance = Math.sqrt(dx * dx + dy * dy);
         return (distance < this.flameCircleRadius + enemy.radius);
    }
    calcFlameCircleCenters(){
       var xDiff = this.tower.target.img.position.x - this.tower.img.position.x;
       var yDiff = this.tower.target.img.position.y - this.tower.img.position.y;
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
       }
    }
  }
  class FireWeapon extends Weapon {
    constructor(tower) {
      super(tower, 3, 200, 50, "Fire", "Fill in")
      this.reloadTime = 1000;
      console.log('range', this.range);
    }
    shoot(enemy){
      super.shoot(enemy, 'FireProjectile', {speed: 50, radius: 0});
    }
  }

  class ThunderWeapon extends Weapon {
    constructor(tower) {
      super(tower, 30, 800, 50, "Thunder", "Fill in")
      this.reloadTime = 2000;
    }
    shoot(enemy){
      super.shoot(enemy, 'ThunderBallProjectile', {power: this.power, speed: 4000, radius: 14})
    }
  }
  class PoisonWeapon extends Weapon {
    constructor(tower) {
      super(tower, 8, 200, 50, 'Poison', 'Fill in');
      this.reloadTime = 1000;
    }
    shoot(enemy) {
      super.shoot(enemy, 'PoisonProjectile', {speed: 100, radius: 8})
    }
  }

  // class BlizzardWeapon extends Weapon {
  //   constructor(tower) {
  //     super(tower, 0.00001, 200, 50, 'Blizzard', 'Fill in')
  //     this.reloadTime = 400;
  //   }
  //   shoot(enemy) {
  //     if(!this.projectile){
  //       super.shoot(enemy, 'PoisonProjectile', {})
  //     }
  //
  //
  //
  //   }
  // }
  return {
    FlameWeapon,
    ThunderWeapon,
    PoisonWeapon,
    FireWeapon
  };
});
