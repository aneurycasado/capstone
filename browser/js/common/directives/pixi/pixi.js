app.directive("pixi", function(){
  return {
    restrict: "E",
    controller: "PixiController"
  }
});

app.controller("PixiController", function($scope){
   console.log("Called");
   var stage = new PIXI.Stage(0x66FF99);
   var renderer = PIXI.autoDetectRenderer(400, 300);
   document.body.appendChild(renderer.view);
   requestAnimationFrame(animate);
   var texture = PIXI.Texture.fromImage("/js/images/creep/creep-1-blue/1.png");
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);
    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    stage.addChild(bunny);
   function animate() {
       requestAnimationFrame( animate );
       renderer.render(stage);
   }
})
