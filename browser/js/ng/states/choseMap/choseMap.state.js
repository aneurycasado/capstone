'use strict'
app.config(function($stateProvider){
	$stateProvider
	.state('choseMap', {
		url: '/',
		templateUrl: '/js/ng/states/choseMap/choseMap.state.html',
		controller: 'ChoseMapController'
	})
});

app.controller('ChoseMapController', function($scope, $state){
	$scope.play = function(){
		$state.go('play',{num:1})
	}
});
