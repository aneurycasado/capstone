'use strict'
let game = require("./components/game");
let tower = require('./components/tower');
let editor = require('./components/editor');
let _ = require('lodash');
let app = require('./ng/app.js');
// require('./ng/states/choseMap/choseMap.state.js');
require('./ng/directives/storeBar/storeBar.js');
// require('./ng/directives/startScreen/startScreen.js');

// document.addEventListener('loadGame', function(e){
	game.init();
// });

document.onclick = function(e) {
    // if(game.state === "playing"){
    	console.log(e.clientX);
    	console.log(e.clientY)
    	console.log(game.cellSize);
    	let towerPositionX = Math.floor(e.clientX / game.cellSize)
    	let towerPositionY = Math.floor(e.clientY / game.cellSize)
    	console.log('x:', towerPositionX);
    	console.log('y:', towerPositionY);
    	tower.createTower(towerPositionX, towerPositionY, 'IceTower');
    // }
}
 
