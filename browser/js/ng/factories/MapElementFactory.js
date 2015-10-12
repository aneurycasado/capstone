app.factory("MapElementFactory", (StateFactory, $http) => {
	let mapElements = [];
	let stage = new PIXI.Stage();
	class MapElement {
		constructor(x,y,opts){
			console.log("The opts", opts);
			this.position = {x: x, y: y};
			this.imgUrl = opts.imgUrl;
			this.mapNum = opts.mapNum;
			if(typeof this.mapNum === "number" && this.mapNum >= 2 && this.mapNum <= 8 && this.mapNum !== 4){
                    this.width = 100;
                    this.height = 50;
           	}
			this.img = PIXI.Texture.fromImage(opts.imgUrl);
			this.element = new PIXI.Sprite(this.img);
			let imgPositions = [this.position.x * StateFactory.cellSize, this.position.y * StateFactory.cellSize]
			console.log("The img", this.img)
			this.element.position.x = imgPositions[0];
        	this.element.position.y = imgPositions[1];
        	if(this.width){
        		this.element.width = this.width;
        		this.element.height = this.height;
        	}else{
        		this.element.width = StateFactory.cellSize;
        		this.element.height = StateFactory.cellSize;
        	}
        	stage.addChild(this.element);
		}
	}

	const createMapElement = (x,y,opts) => {
		let mapElement = new MapElement(x,y,opts);
		let currentGridNode = StateFactory.map.grid[y][x];
        mapElements.push(mapElement);
        currentGridNode.contains.element = mapElement;
	}

	const createMap = (map) => {
		console.log("map in createMap",map);
		console.log(typeof map);
        return $http.post("/api/maps/",map).then(response => response.data);
    }

    const getMaps = () => {
    	console.log("Get maps called");
    	return $http.get("/api/maps/").then(response => response.data);
    }

	return {
		stage,
		createMapElement,
		mapElements,
		createMap,
		getMaps
	}

})