'use strict'
app.factory('MapFactory', function(StateFactory, MapGridsFactory, ClickHandlerFactory) {

    class GridNode {
        constructor(x, y, opts) {
            this.x = x;
            this.y = y;
            this.coords = {x: x * StateFactory.cellSize, y: y * StateFactory.cellSize};
            this.enterable = true;
            this.contains = {};
            this.canPlaceTower = false;
            this.terrain = opts.terrain;
            if (opts) {
                if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
                this.img.interactive = true;
                this.img.click = ClickHandlerFactory.gridClickHandler.bind(this);
                this.img.position.x = this.coords.x;
                this.img.position.y = this.coords.y;
                if (opts.canPlaceTower) this.canPlaceTower = true;
            }
        }
    }

    class Map {
        constructor(grid, textures){
            this.stage = new PIXI.Stage();
            this.grid = insertNodes(grid, textures, this, false);
            this.path = findPath(this.grid);
        }
    }

    class MultiplePaths {
        constructor(grid, textures, gridArray){
            this.stage = new PIXI.Stage();
            this.grid = insertNodes(grid, textures, this, false);
            this.path = [];
            gridArray.forEach(function(grid){
                let newGrid = insertNodes(grid,textures,this,true);
                let path = findPath(newGrid);
                console.log("Path found, ",path);
                this.path.push(path);
            }.bind(this));
        }
    }

    let insertNodes = (grid, textures, map,multiplePaths) => {

        let tile;
        let canPlaceTower;
        for(let row = 0; row < grid.length; row++){
            for(let col = 0; col < grid[row].length; col++){
                canPlaceTower = false;
                if(grid[row][col] === 4){
                    tile = textures.tile;
                }
                if(grid[row][col] === 1){
                    tile = textures.path;
                }else if(grid[row][col] === 2){
                    tile = textures.tree;
                }else if(grid[row][col] === 3){
                    tile = textures.destination;
                }else if(grid[row][col] === 0){
                    canPlaceTower = true;
                    tile = textures.tile;
                }
                grid[row][col] = new GridNode(col, row, {img: tile, canPlaceTower: canPlaceTower, terrain: grid[row][col]});
                if(!multiplePaths) map.stage.addChild(grid[row][col].img);
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

    let textures = {tile: "01", path: "13", tree: "03", destination: "07"};
    let maps = [];
    maps.push(new Map(MapGridsFactory.mapGrid1, textures));
    maps.push(new MultiplePaths(MapGridsFactory.mapGrid2,textures,MapGridsFactory.mapGrid2Array));
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
