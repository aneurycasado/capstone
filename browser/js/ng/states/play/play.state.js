var app = require('../app.js');

app.config(function($stateProvider){
   $stateProvider
   .state('play', {
           url: '/play',
           templateUrl: '/js/ng/states/play/play.state.html',
           controller: 'PlayController'
       })
});

app.controller('PlayController', function($scope, GameFactory) {
    GameFactory.init();
});
