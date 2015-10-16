app.factory("MapElementFactory", (StateFactory, SpriteEventFactory, $http) => {
	let mapElements = [];
	let stage = new PIXI.Stage();
	class MapElement {
		constructor(x,y,opts){
			// console.log("The opts", opts);
			this.name = opts.name;
			this.position = {x: x, y: y};
			this.imgUrl = opts.imgUrl;
			this.mapNum = opts.mapNum;
			if(typeof this.mapNum === "number" && this.mapNum >= 2 && this.mapNum <= 8 && this.mapNum !== 4){
                    this.width = 100;
                    this.height = 50;
           	}
			this.img = PIXI.Texture.fromImage(opts.imgUrl);
			this.sprite = new PIXI.Sprite(this.img);
			let imgPositions = [this.position.x * StateFactory.cellSize, this.position.y * StateFactory.cellSize]
			// console.log("The img", this.img)
			this.sprite.position.x = imgPositions[0];
        	this.sprite.position.y = imgPositions[1];
        	this.sprite.interactive = true;
        	if(this.width){
        		this.sprite.width = this.width;
        		this.sprite.height = this.height;
        	}else{
        		this.sprite.width = StateFactory.cellSize;
        		this.sprite.height = StateFactory.cellSize;
        	}
        	stage.addChild(this.sprite);
        	this.sprite.click = SpriteEventFactory.mapElementClickHandler.bind(this);
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

    const remove = (removedElement) => {
    	console.log("Element received in remove ", removedElement);
    	stage.removeChild(removedElement.sprite);
    	
    	mapElements.forEach((element, index) =>{
    		console.log("elements in mapElements", element);
    		if(element.position.x === removedElement.position.x && element.position.y === removedElement.position.y){
    			console.log("Matching element", element);
    			mapElements.splice(index,1);
    			return;
    		}
    	})
    	let currentGridNode = StateFactory.map.grid[removedElement.position.y][removedElement.position.x];
    	currentGridNode.contains.element = null;
    }

	return {
		stage,
		createMapElement,
		mapElements,
		createMap,
		getMaps,
		remove
	}

})