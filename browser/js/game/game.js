var game = {

  rows: 10,
  cols: 10,

  startRow : 1,
  startCol : 0,

  state: "init",
  stages : {},
  //towers : createTowers(towers);
}

game.init = function(){

	game.endRow = game.rows-2;
	game.endCol  = game.cols-1;
	game.cellWidth = window.innerWidth / game.cols;
	game.cellHeight = window.innerHeight / game.rows;
	game.stages["play"] = new PIXI.Stage(0x66FF99);
	game.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

	document.body.appendChild(game.renderer.view);
	game.grid = createGrid(game.rows, game.cols);


	game.state = "play";
	game.start();
}

game.start = function(){

	game.main();
}

game.main = function(){

	if(game.state == "init"){

	}
	if(game.state == "play"){
		game.update();
	}


	//console.log(Date.now(), this);
	game.renderer.render(game.stages[game.state]);
	requestAnimationFrame(game.main);
}

game.update = function(){

	//game logic
}

function createGrid(rows, cols){
	var grid = [];

	for(var row = 0; row < rows; row++){
		grid[row] = [];
    	for(var col = 0; col < cols; col++){
            if(row === 0) new GridNode(col, row, {img: "13"})
            else {
                grid[row][col] = new GridNode(col, row, {img: "01"});
            }

    	}
    }

  	return grid;
}

function GridNode(x, y, opts){
	this.x = x;
	this.y = y;
	this.coords = { x: x * (game.cellWidth), y: y * game.cellHeight}
	this.enterable = true;
	this.contains = false;

	if(opts){
		if(opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
		this.img.position.x = this.coords.x;
		this.img.position.y = this.coords.y;
		game.stages["play"].addChild(this.img);
	}

};

game.init();
  // var imgRoute;
  //      var imgRoute = "/js/images/background-tilesets/01.png";
  //     if(row === 0){
  //       imgRoute = "/js/images/background-tilesets/15.png";
  //     }else if(row === rows - 1){
  //       imgR     texture:
  //       tag: 'land',
  //       x: col*(cellWidth-30),
  //       y: row*cellHeightoute = "/js/images/background-tilesets/14.png";
  //     }else if(col === 0 && row !== startRow){
  //       imgRoute = "/js/images/background-tilesets/13.png";
  //     }else if(col === cols-1 && row !== endRow){
  //       imgRoute = "/js/images/background-tilesets/08.png";
  //     }else if(row === startRow && col === startCol){
  //       imgRoute = "/js/images/background-tilesets/01.png";
  //     }else if(row === endRow && col === endCol){
  //       imgRoute = "/js/images/background-tilesets/01.png";
  //     }
  //     else{
  //       imgRoute = "/js/images/background-tilesets/01.png";
  //     }
