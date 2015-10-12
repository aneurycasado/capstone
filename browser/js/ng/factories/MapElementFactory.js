app.factory("MapElementFactory", (StateFactory) => {
	let mapElements = [];
	let stage = new PIXI.Stage();
	class MapElement {
		constructor(x,y,opts){
			console.log("The opts", opts);
			this.position = {x: x, y: y};
			this.img = PIXI.Texture.fromImage(opts.imgUrl);
			this.element = new PIXI.Sprite(this.img);
			let imgPositions = [this.position.x * StateFactory.cellSize + (this.element.width/2)  , this.position.y * StateFactory.cellSize]
			console.log("The img", this.img)
			this.element.position.x = imgPositions[0];
        	this.element.position.y = imgPositions[1];
        	stage.addChild(this.element);
		}
	}

	const createMapElement = (x,y,opts) => {
		let mapElement = new MapElement(x,y,opts);
		let currentGridNode = StateFactory.map.grid[y][x];
        mapElements.push(mapElement);
        currentGridNode.contains.element = mapElement;
	}

	return {
		stage,
		createMapElement,
		mapElements,
	}

})