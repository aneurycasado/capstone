'use strict'

app.factory('MapFactory', (StateFactory, DesignFactory, SpriteEventFactory, $http) => {
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
                    this.img.interactive = true;
                    this.img.click = SpriteEventFactory.gridClickHandler.bind(this);
                    this.img.position.x = this.coords.x;
                    this.img.position.y = this.coords.y;
                    this.img.texture.width = StateFactory.cellSize;
                    if(opts.width) this.img.width = opts.width;
                    else this.img.width = StateFactory.cellSize;
                    if(opts.height) this.img.height = opts.height;
                    else this.img.height = StateFactory.cellSize;
                }
            }
        }
    }

    class Map {
        constructor(grid, num){
            this.stage = new PIXI.Stage();
            this.paths = Pathfinder(grid);
            this.grid = insertNodes(grid, this);
            this.imgSrc = "/images/maps/"+num+".png";
        }
    }

    let insertNodes = (grid, map) => {
        var newGrid = grid.slice();
        newGrid.forEach(function(row){
            row = row.slice();
        });

        for(let row = 0; row < newGrid.length; row++){
            for(let col = 0; col < newGrid[row].length; col++){      
                let texture;
                let img;
                let width;
                let height;
                let nodeValue = newGrid[row][col];
                if(typeof nodeValue == "number" && nodeValue >= 2 && nodeValue <= 8 && nodeValue !== 4){
                    width = 100;
                    height = 50;
                }
                if(typeof nodeValue === "number" && nodeValue >= 2 && nodeValue <= 8 && nodeValue !== 4){
                    width = 80;
                    height = 40;
                }
                texture = terrainToTexture[nodeValue];
                if(texture){
                    if(texture.constructor == Array) texture = texture[Math.floor(Math.random() * (texture.length))];
                    img = textureToImage[texture];
                }
          
                newGrid[row][col] = new GridNode(col, row, {img: img, width: width, height: height, terrain: newGrid[row][col]});
                if(newGrid[row][col].img) map.stage.addChild(newGrid[row][col].img);

            }
        }
        return newGrid;
    }


    let Pathfinder = function(layout) {
        let base = {}; 
        let bases = [];
        let destination = {};
        let path = [];
        let finalPath = [];
        let gridRowLength = layout.length; 
        let gridColLength = layout[0].length;
        let barrenPath = new PF.Grid(DesignFactory.blankMap);
        let finder = new PF.AStarFinder({
             diagonalMovement: PF.DiagonalMovement.Never
        });
        let OptimalPath = [];
        let returnedPath = [];
        let array_lengths = [];

        let PFwalkableGrid = function () {
            for(let x = 0; x < gridRowLength; x++) {
                for(let y = 0; y < gridColLength; y++) {
                    if(layout[x][y] === 1 || layout[x][y] === 3 || layout[x][y] === 4) {
                        barrenPath.nodes[x][y].walkable = true;
                    }
                    else {
                        barrenPath.nodes[x][y].walkable = false;
                    }
                }
            }
        };
        
        let getStartandEndPts = function () {
            for(let x = 0; x < layout.length; x++) {
                 for(let y = 0; y < layout[x].length; y++) {
                     if(layout[x][y] === 4) {
                         bases.push({x: x, y: y, num: 4})
                     }
                     if(layout[x][y] === 3) {
                        destination.column = y;
                        destination.row = x;
                     }
                 }
             }
        };

        let getPathforEnemy = function() {
            PFwalkableGrid();
            getStartandEndPts();
            bases.forEach(function(startNode){
                let walkablePath = barrenPath.clone();
                OptimalPath.push(finder.findPath(startNode.y,startNode.x, destination.column, destination.row, walkablePath))
            })
            OptimalPath.forEach(function(arr){  
                array_lengths.push(arr.length);
            })
            OptimalPath.forEach(function(sub_path){
                sub_path.forEach(function(coords){
                    let coordinates = {};
                    coordinates.x = coords[0]*StateFactory.cellSize + StateFactory.cellSize/2; 
                    coordinates.y = coords[1]*StateFactory.cellSize + StateFactory.cellSize/2;
                    returnedPath.push(coordinates);
                })
            })
            array_lengths.forEach(function(length){
                finalPath.push(returnedPath.splice(0, length))
            })
        };
        
        getPathforEnemy();
        return finalPath;

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
        base: "13",
    };

    let terrainToTexture = {
        0: "none",
        1: "none",
        3: "base",
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
        "B1": "base1",
        "B2": "base2",
        "B3": "base3",
    };

    let maps = [];
    maps.push(new Map(DesignFactory.mapGrid3,3));
    // maps.push(new Map(DesignFactory.mapGrid2, 2));
    // maps.push(new Map(DesignFactory.mapGrid3, 3));



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

    const createMap = (mapGrid) => {
        let grid = [];
        for(let key in mapGrid){
            console.log("key",key);
            grid.push(mapGrid[key]);
        }
        console.log("The grid ", grid);
        maps.push(new Map(grid,4));
    }


    return {
        reset,
        Map,
        maps,
        createMap
    };
});