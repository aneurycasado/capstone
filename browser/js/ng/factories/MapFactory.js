'use strict'
app.factory('MapFactory', function(StateFactory, DesignFactory, SpriteEventFactory) {
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
            this.paths = findPath(grid);
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



    let findPath = function(terrain) {
        let base = {}; 
        let bases = [];
        let destination = {};
        let path = [];
        let gridNodePath = [];
        let sub_path_lengths = [];
        let finalPath = [];
        let getStartandEndPts = function () {
            for(let x = 0; x < terrain.length; x++) {
                 for(let y = 0; y < terrain[x].length; y++) {
                     if(terrain[x][y] === 4) {
                         bases.push({x: x, y: y, num: 4})
                     }
                     if(terrain[x][y] === 3) {
                        destination.row = x;
                        destination.column = y;
                     }
                 }
             }
        };
        let checkUpIsWalkable = function (currentPosition) {
            if (currentPosition.row === 0) return null;
            return {
                position: {
                    row: currentPosition.row - 1,
                    column: currentPosition.column
                },
                num: terrain[currentPosition.row - 1][currentPosition.column]
            };
        };
        let checkDownIsWalkable = function (currentPosition) {
            if (currentPosition.row + 1 > terrain.length - 1) return null;
            return {
                position: {
                    row: currentPosition.row + 1,
                    column: currentPosition.column
                },
                num: terrain[currentPosition.row + 1][currentPosition.column]
            };
        };
        
        let checkLeftIsWalkable = function (currentPosition) {
            if (currentPosition.column === 0) return null;
            return {
                position: {
                    row: currentPosition.row,
                    column: currentPosition.column - 1
                },
                num: terrain[currentPosition.row][currentPosition.column - 1]
            };
        };
        
        let checkRightIsWalkable = function (currentPosition) {
            if (currentPosition.column + 1 > terrain[0].length - 1) return null;
            return {
                position: {
                    row: currentPosition.row,
                    column: currentPosition.column + 1
                },
                num: terrain[currentPosition.row][currentPosition.column + 1]
            };
        };
        
        let getDirectionIsWalkableDict = {
            left: checkLeftIsWalkable,
            right: checkRightIsWalkable,
            up: checkUpIsWalkable,
            down: checkDownIsWalkable
        };
        
        let getInverseDirection = function (direction) {
            if (direction === null) return null;
            return ({
                left: 'right',
                right: 'left',
                up: 'down',
                down: 'up'
            })[direction];
        };
        
        let calculateBestDirection = (currentPosition, directions, base) => {
        
            let closer = (key, dir) => {
                return Math.abs(base[key] - currentPosition[key]) > Math.abs(base[key] - dir.position[key]);
            };
        
            let goodEnoughDirection = directions.find(dir => {
                return closer('column', dir) || closer('row', dir);
            });
        
            return goodEnoughDirection || directions[0];
        
        };
        
        function getPathForEnemy(currentPosition, playerBaseCell, lastDirection) {
        
            let possibleDirections = ['up', 'left', 'down', 'right']
                .filter(d => d !== getInverseDirection(lastDirection)) // remove inverse direction
                .map(d => Object.assign({ direction: d }, getDirectionIsWalkableDict[d](currentPosition))) // map to information
                .filter(dObj => [1,3].indexOf(dObj.num) !== -1); // remove 0, 2, 4
        
            let finalCell = possibleDirections.filter(d => d.num === 3)[0];
            if (finalCell) return [finalCell.position];
        
            let chosenDirection;
            if (possibleDirections.length === 1) {
                chosenDirection = possibleDirections[0];
            } else {
                chosenDirection = calculateBestDirection(currentPosition, possibleDirections, playerBaseCell);
            }
            return [chosenDirection.position, ...getPathForEnemy(chosenDirection.position, playerBaseCell, chosenDirection.direction)];
        };
        let determineSubPaths = function () {
            getStartandEndPts();
            bases.forEach(function(startNode){
                path.push(getPathForEnemy({row: startNode.x, column: startNode.y}, destination, null))
            })
        }
        let determineArrayLength = function() {
            path.forEach(function(sub_path){
                sub_path_lengths.push(sub_path.length);
            })
        }
        let pathGenerator = function(path) {
            determineSubPaths();
            determineArrayLength();
            path.forEach(function(sub_path){
                sub_path.forEach(function(node){
                    gridNodePath.push({
                    x: node.column*StateFactory.cellSize + StateFactory.cellSize/2, 
                    y: node.row*StateFactory.cellSize + StateFactory.cellSize/2 })
                })
            })
            sub_path_lengths.forEach(function(spliceValue){
                let reconfiguring = gridNodePath.splice(0, spliceValue);
                finalPath.push(reconfiguring);
            })
        }
        pathGenerator(path);
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
