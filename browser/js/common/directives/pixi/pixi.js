app.directive("pixi", function(){
  return {
    restrict: "E",
    controller: "PixiController"
  }
});

function Game(rows,cols,towers){
  this.rows = rows;
  this.cols = cols;
  console.log("Width ",window.innerWidth);
  console.log("Height ", window.innerHeight);
  var cellWidth = window.innerWidth / cols
  var cellHeight = window.innerHeight / rows
  console.log(cellWidth);
  console.log(cellHeight);
  var startRow = 1;
  var startCol = 0;
  var endRow = rows -2;
  var endCol = cols -1;
  // this.towers = createTowers(towers);
  this.grid = [];
  for(var col = 0; col < cols; col++){
    for(var row = 0; row < rows; row++){
      var imgRoute;
       var imgRoute = "/js/images/background-tilesets/01.png";
      if(row === 0){
        imgRoute = "/js/images/background-tilesets/15.png";
      }else if(row === rows - 1){
        imgRoute = "/js/images/background-tilesets/14.png";
      }else if(col === 0 && row !== startRow){
        imgRoute = "/js/images/background-tilesets/13.png";
      }else if(col === cols-1 && row !== endRow){
        imgRoute = "/js/images/background-tilesets/08.png";
      }else if(row === startRow && col === startCol){
        imgRoute = "/js/images/background-tilesets/01.png";
      }else if(row === endRow && col === endCol){
        imgRoute = "/js/images/background-tilesets/01.png";
      }
      else{
        imgRoute = "/js/images/background-tilesets/01.png";
      }
      var obj = {
        texture: PIXI.Texture.fromImage(imgRoute),
        tag: 'land',
        x: col*(cellWidth-30),
        y: row*cellHeight
      }
      this.grid.push(obj);
    }
  }
}


app.controller("PixiController", function($scope, $rootScope){
  if(!$rootScope.called){
    $rootScope.called = true;
     console.log("Called");
     var stage = new PIXI.Stage(0x66FF99);
     var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.view);
     requestAnimationFrame(animate);
     var game = new Game(10,10,13);
     game.grid.forEach(function(cell){
        var texture = cell.texture;
        var land = new PIXI.Sprite(texture);
        console.log("x ",cell.x);
        console.log("y ", cell.y);
        // land.anchor.x = 0.5;
        // land.anchor.y = 0.5;
        land.position.x = cell.x;
        land.position.y = cell.y;
        stage.addChild(land);
     })
     function animate() {
         requestAnimationFrame( animate );
         renderer.render(stage);
     }
   }else{
     console.log("Sucks");
   }
})
