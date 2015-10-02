var GridNode = require('../grid').GridNode;

var Map = function(path, grid, textures){
  this.path = path;
  this.grid = insertNodes(grid, textures);
};

function insertNodes(grid, textures){
  console.log(textures);
    for(var row = 0; row < grid.length; row++){
        for(var col = 0; col < grid[row].length; col++){
            if(grid[row][col] === 0){
              grid[row][col] = new GridNode(col, row, {img: textures.tile, canPlaceTower: true});
            }else 
            if(grid[row][col] === 1){
              grid[row][col] = new GridNode(col, row, {img: textures.path});
            }else 
            if(grid[row][col] === 2){
              grid[row][col] = new GridNode(col, row, {img: textures.tree});
            }else 
            if(grid[row][col] === 3){
              grid[row][col] = new GridNode(col, row, {img: textures.destination});
            }
        }
    }
    return grid;
}

var mapGrid1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0],
  [0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,1,1,1,0,0,1,0,1,0,1,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
  [0,0,3,1,1,1,0,0,2,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

  var textures = {tile: "01", path: "13", tree: "03", destination: "07"};
  var maps = [];
  maps.push(new Map(null, mapGrid1, textures));

  module.exports = {
    Map: Map,
    maps: maps,
  };