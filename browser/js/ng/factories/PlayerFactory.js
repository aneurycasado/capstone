'use strict'
app.factory('PlayerFactory', ($http) => {
    let factory = {health:20,money:500000};
    factory.saveGame = (player) => {
        console.log("Player in saveGame", player);
    	return $http.put("/api/players/",player).then(response => response.data);
    }
    factory.getGame = () => {
    	return $http.get("/api/players/me").then(response => response.data);
    }
    factory.restart = function(){
    	this.health = 20;
    	this.money = 500000;
    }.bind(factory);
    return factory;
});
