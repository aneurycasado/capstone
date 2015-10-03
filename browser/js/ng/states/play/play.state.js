'use strict'
app.config(function($stateProvider){
   $stateProvider
   .state('play', {
           url: '/play',
           templateUrl: '/js/ng/states/play/play.state.html',
           controller: 'PlayController'
       })
});

app.controller('PlayController', function($scope, $rootScope, GameFactory, TowerFactory) {
    console.log('play');
    GameFactory.init();
    $scope.tower = null;
    $rootScope.$on("currentTower", function(event,data){
      $scope.tower = data;
    })
    $('canvas').on('click', function(e) {
        if($scope.tower !== null){
          let towerPositionX = Math.floor(e.offsetX / GameFactory.cellSize);
          let towerPositionY = Math.floor(e.offsetY / GameFactory.cellSize);
          TowerFactory.createTower(towerPositionX, towerPositionY, $scope.tower.type + "Tower");
        }
    })
});
