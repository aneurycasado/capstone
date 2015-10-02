'use strict'
app.config(function($stateProvider){
   $stateProvider
   .state('play', {
           url: '/play',
           templateUrl: '/js/ng/states/play/play.state.html',
           controller: 'PlayController'
       })
});

app.controller('PlayController', function($scope, GameFactory) {
    console.log('play');
    GameFactory.init();
});
