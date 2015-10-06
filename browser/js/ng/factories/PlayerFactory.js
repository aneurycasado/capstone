'use strict'
app.factory('PlayerFactory', function($http) {
    let factory = {health:20,money:200};
    factory.saveGame = (player) => {
    	return $http.put("/api/players/",player).then(response => response.data);
    }
    factory.getGame = () => {
    	return $http.get("/api/players/me").then(response => response.data);
    }
    factory.restart = function(){
    	this.health = 20;
    	this.money = 200;
    }.bind(factory);
    return factory;
});
