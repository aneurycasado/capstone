'use strict'
app.factory('PlayerFactory', function($http) {
    var factory = {health:20,money:200};
    factory.saveGame = function(player){
    	return $http.put("/api/players/",player).then(response => response.data);
    }
    factory.getGame = function(){
    	return $http.get("/api/players/me").then(response => response.data);
    }
    return factory;
});
