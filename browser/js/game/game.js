var game = {
  width: 1000,

  rows: 13,
  cols: 20,
};

game.init = function(){

  game.stages = {};
  game.map = {};
	game.endRow = game.rows-2;
	game.endCol  = game.cols-1;
  //base cell size on width
	game.cellSize = game.width / game.cols;
  //adjust height to fit grid
  game.height = (game.rows / game.cols) * game.width;
	game.stages.play = new PIXI.Stage(0x66FF99);
	game.renderer = PIXI.autoDetectRenderer(game.width, game.height);

	document.body.appendChild(game.renderer.view);
	game.grid = createGrid(game.rows, game.cols);

	game.state = "play";
	game.main();
};

game.main = function(){

	if(game.state == "play"){
		game.update();
	}

	//console.log(Date.now(), this);
	game.renderer.render(game.stages[game.state]);
	requestAnimationFrame(game.main);
};


game.update = function(){

	//game logic
};

function createGrid(rows, cols){
	var grid = [];

	for(var row = 0; row < rows; row++){
		grid[row] = [];
    	for(var col = 0; col < cols; col++){
            if(row === 0) new GridNode(col, row, {img: "13"});
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
	this.coords = { x: x * (game.cellSize), y: y * game.cellSize};
	this.enterable = true;
	this.contains = false;

	if(opts){
		if(opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
		this.img.position.x = this.coords.x;
		this.img.position.y = this.coords.y;
		game.stages.play.addChild(this.img);
	}

}

game.start = function(map){

  game.state = "play";
};

game.init();

