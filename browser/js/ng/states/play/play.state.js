'use strict'
app.config(function($stateProvider){
   $stateProvider
   .state('play', {
           url: '/play',
           templateUrl: '/js/ng/states/play/play.state.html',
           controller: 'PlayController'
       })
});

app.controller('PlayController', function($scope, GameFactory, TowerFactory) {
    console.log('play');
    GameFactory.init();
    $('canvas').on('click', function(e) {
        // if(game.state === "playing"){
        //console.log(e.offsetX, e.clientX);
        //console.log(e.offsetY);
        let towerPositionX = Math.floor(e.offsetX / GameFactory.cellSize);
        let towerPositionY = Math.floor(e.offsetY / GameFactory.cellSize);
        console.log('x:', towerPositionX);
        console.log('y:', towerPositionY);
        TowerFactory.createTower(towerPositionX, towerPositionY, 'IceTower');
        // }
    })
});
