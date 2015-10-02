app.factory("ProjectileFactory", function(GameFactory){
  class Projectile {
    constructor(x, y, radius, speed){
      this.x = x;
      this.y = y;
          this.radius = radius;
          this.speed = speed;
          this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/tower-defense/tower-defense-levels-ship.png"));
          this.img.position.x = x;
          this.img.position.y = y;
          GameFactory.stages["play"].addChild(this.img);
      }
  }

  class HomingProjectile extends Projectile {
      constructor(x, y, radius, speed, enemy){
          super(x, y, radius, speed);
          this.target = enemy;
      }

      update() {
          this.theta = Math.atan(this.target.x - this.x) / ( this.target.y - this.y);
          this.xVel = speed*Math.sin(this.theta);
          this.yVel = speed*Math.cos(this.theta);
          this.x += this.xVel;
          this.y += this.yVel;
          this.img.position.x = this.x;
          this.img.position.y = this.y;
      }
  }

  return {
    Projectile,
    HomingProjectile
  }
});