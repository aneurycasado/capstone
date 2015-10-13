'use strict'
app.factory('PlayerFactory', ($http) => {
    let player = {health:20,money:200};
    player.saveGame = (player) => {
        console.log("Player in saveGame", player);
    	return $http.put("/api/players/",player).then(response => response.data);
    }
    player.getGame = () => {
    	return $http.get("/api/players/me").then(response => response.data);
    }
    player.restart = function(){
    	this.health = 20;
    	this.money = 200;
    }.bind(player);
    return player;
});
    