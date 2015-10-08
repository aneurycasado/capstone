'use strict'
app.factory('MapFactory', function(StateFactory, DesignFactory, ClickHandlerFactory) {
    class GridNode {
        constructor(x, y, opts) {
            this.x = x;
            this.y = y;
            this.coords = {x: x * StateFactory.cellSize, y: y * StateFactory.cellSize};
            this.enterable = true;
            this.contains = {};
            this.terrain = opts.terrain;
            if (opts) {

                if (opts.img){
                    this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
                    this.img.position.x = this.coords.x;
                    this.img.position.y = this.coords.y;
                    if(opts.width) this.img.width = opts.width;
                    else this.img.width = StateFactory.cellSize;
                    if(opts.height) this.img.height = opts.height;
                    else this.img.height = StateFactory.cellSize;                
                }
            } 
        }
    }

    class Map {
        constructor(grid,num){
            this.stage = new PIXI.Stage();
            this.grid = insertNodes(grid, this, false);
            this.path = findPath(this.grid);
            this.imgSrc = "/images/maps/"+num+".png";
        }
    }

    class MultiplePaths {
        constructor(grid, gridArray,num){
            this.stage = new PIXI.Stage();
            this.grid = insertNodes(grid, this, false);
            this.path = [];
            gridArray.forEach(function(grid){
                let newGrid = insertNodes(grid,this,true);
                let path = findPath(newGrid);
                this.path.push(path);
            }.bind(this));
            this.imgSrc = "/images/maps/"+num+".png";
        }
    }

    let insertNodes = (grid, map,multiplePaths) => {

        for(let row = 0; row < grid.length; row++){

            for(let col = 0; col < grid[row].length; col++){      
                let texture;
                let img;
                let width;
                let height;
                let nodeValue = grid[row][col]
                if(typeof nodeValue == "number" && nodeValue >= 2 && nodeValue <= 8 && nodeValue !== 4){
                    width = 100;
                    height = 50;
                } 

                texture = terrainToTexture[nodeValue];

                if(texture){
                    if(texture.constructor == Array) texture = texture[Math.floor(Math.random() * (texture.length))];
                    img = textureToImage[texture]; 
                }
          
                grid[row][col] = new GridNode(col, row, {img: img, width: width, height: height, terrain: grid[row][col]});
                if(!multiplePaths && grid[row][col].img) map.stage.addChild(grid[row][col].img);
            }
        }
        return grid;
    }

    let findPath = function(grid) {

        let path = [];

        let start = {};

        for(let x = 0; x < grid.length; x++) {
            for(let y = 0; y < grid[x].length; y++) {
                if(grid[x][y].terrain === 4) {
                    path.push({x: grid[x][y].coords.x + (StateFactory.cellSize/2), y: grid[x][y].coords.y + (StateFactory.cellSize/2)})
                    start.x = x;
                    start.y = y;
                    break;
                }
            }
        }

        function lookAround(x, y, num, next, lastDirection){
            if(grid[x-1] && grid[x-1][y].terrain == num && lastDirection !== "down") {
                next.x = x-1;
                next.direction = "up";
                path.push({x: grid[x][y].coords.x + (StateFactory.cellSize/2), y: grid[x][y].coords.y + (StateFactory.cellSize/2), direction: lastDirection})
                return true;
            }
            else if(grid[x+1] && grid[x+1][y].terrain == num && lastDirection !== "up"){
                next.x = x+1;
                next.direction = "down";
                path.push({x: grid[x][y].coords.x + (StateFactory.cellSize/2), y: grid[x][y].coords.y + (StateFactory.cellSize/2), direction: lastDirection})
                return true;
            }
            else if(grid[x][y-1] && grid[x][y-1].terrain == num && lastDirection !== "right"){
                next.y = y-1;
                next.direction = "left";
                path.push({x: grid[x][y].coords.x + (StateFactory.cellSize/2), y: grid[x][y].coords.y + (StateFactory.cellSize/2), direction: lastDirection})
                return true;
            }
            else if(grid[x][y+1] && grid[x][y+1].terrain == num && lastDirection !== "left"){
                next.y = y+1;
                next.direction = "right";
                path.push({x: grid[x][y].coords.x + (StateFactory.cellSize/2), y: grid[x][y].coords.y + (StateFactory.cellSize/2), direction: lastDirection})
                return true;
            }

        }

        let count = 0;
        function explore(x, y, lastDirection){
            count++;
            if(grid[x][y].terrain == 3){
                return path;
            }
            let next = {x: x, y: y};
            if(lookAround(x, y, 3, next, lastDirection)){

                path.push({x: grid[next.x][next.y].coords.x + (StateFactory.cellSize/2), y: grid[next.x][next.y].coords.y + (StateFactory.cellSize/2)})

                return path;
            }

            lookAround(x, y, 1, next, lastDirection);


            explore(next.x, next.y, next.direction)
        }

        explore(start.x, start.y, '');

        return path;
    }

    let textureToImage = {
        tile1: "01", tile2: "02", 
        tile3: "03", detail1: "08",
        detail2: "09", detail3: "10",
        detail4: "11", lights1: "04",
        lights2: "05", lights3: "06",
        lights4: "07", panelTop: "14",
        panelBottom: "15", base1: "12",
        base2: "13-1", base3: "13-2",
        base4: "13-3", path: "13",
        platformBL: "17",platformUL: "18",
        platformBR: "19", platformUR: "20",
        platformH: "21", platformV: "22",
        platformX: "16", hangar: "23",
    };

    let terrainToTexture = {
        0: "none",
        1: "none",
        3: "base1",
        2: ["detail1", "detail2", "detail3"],
        5: ["lights1", "lights2", "lights3", "lights4"],
        6: ["tile1", "tile2", "tile3"],
        4: "hangar",
        7: "panelBottom",
        8: "panelTop",
        "BL": "platformBL",
        "BR": "platformBR",
        "H": "platformH",
        "V": "platformV",
        "UL": "platformUL",
        "UR": "platformUR",
        "X": "platformX",
    };

    let maps = [];
    maps.push(new Map(DesignFactory.mapGrid1,1));
    maps.push(new MultiplePaths(DesignFactory.mapGrid2,DesignFactory.mapGrid2Array,2));
    maps.push(new MultiplePaths(DesignFactory.mapGrid3,DesignFactory.mapGrid3Array,3));
    let reset = () => {
        maps.forEach((map) => {
            map.grid.forEach((row) => {
                row.forEach((node) => {
                    node.contains = {};
                    if(node.terrain == 0) node.canPlaceTower = true;
                });
            })
        })
    }
    return {
        reset,
        Map,
        maps
    };
})
