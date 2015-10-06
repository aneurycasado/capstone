app.factory("ProjectileFactory", function(StateFactory, ParticleFactory){

  var projectiles = [];

  var stage = new PIXI.Stage();


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
          this.fire.destroy();
          projectiles.splice(projectiles.indexOf(this), 1);
      }
  }

  class HomingProjectile extends Projectile {
      constructor(opts){
          super(opts);
          this.target = opts.enemy;
          this.fire = ParticleFactory.createFire(stage);
          this.fire.updateOwnerPos(this.x, this.y);
          for(var opt in opts){
            this[opt] = opts[opt];
          }
      }

      update() {
          if(checkCircleCollision(this, this.target)){
              this.target.takeDamage(this.power);
              //if(this.target.health <= 0) this.target = null;
              //console.log(this.target.health);
              this.terminate();
          }else{
              // console.log('target', this.target);
              // console.log('ship', this.x, this.y);
              // console.log('diff',this.target.x - this.x,  this.target.y - this.y);
              this.theta = (Math.atan((this.target.position.x - this.x) / (this.target.position.y - this.y)));

              // console.log('theta', this.theta);
              this.xVel = this.speed*Math.sin(this.theta);
              this.yVel = this.speed*Math.cos(this.theta);
              // console.log("vels",this.xVel, this.yVel);
              if(this.y <= this.target.y) {
                this.x += this.xVel;
                this.y += this.yVel;
              }else{
                this.x -= this.xVel;
                this.y -= this.yVel;
              }
              this.fire.update(1);
              this.fire.updateOwnerPos(this.x, this.y);
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
    stage,
    Projectile,
    HomingProjectile,
    updateAll
  };
});
