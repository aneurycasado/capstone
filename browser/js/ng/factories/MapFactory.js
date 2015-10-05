'use strict'
app.factory('MapFactory', function(GridFactory, StateFactory) {

    class Map {
        constructor(grid, textures){
            this.stage = new PIXI.Stage();
            this.grid = insertNodes(grid, textures, this);
            this.path = findPath(this.grid);
        }
    }

    let insertNodes = (grid, textures, map) => {

        console.log(textures);
        var tile;
        var canPlaceTower;
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
                grid[row][col] = new GridFactory.GridNode(col, row, {img: tile, canPlaceTower: canPlaceTower, terrain: grid[row][col]});
                map.stage.addChild(grid[row][col].img);
            }
        }
        return grid;
    }

    var findPath = function(grid) {

        var path = [];

        var start = {};

        for(var x = 0; x < grid.length; x++) {
            for(var y = 0; y < grid[x].length; y++) {
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

        var count = 0;
        function explore(x, y, lastDirection){
            count++;
            if(grid[x][y].terrain == 3){
                return path;
            }
            var next = {x: x, y: y};
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


    let mapGrid1 = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
        [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,1,0,1,0,1,0,0,0],
        [4,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,0,0,0],
        [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
        [0,0,3,1,1,1,0,0,2,0,0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    let textures = {tile: "01", path: "13", tree: "03", destination: "07"};
    let maps = [];
    maps.push(new Map(mapGrid1, textures));

    return {
        Map,
        maps
    };
})
