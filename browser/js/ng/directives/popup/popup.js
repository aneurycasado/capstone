app.directive('popover', function() {
   return {
   		restrict: "A",
   		link: function(scope,elem){
   			console.log("scope", scope);
   			let name = scope.tower.name;
   			let price = scope.tower.price;
   			let effect = scope.tower.effect;
   			console.log(name,price,effect);
   			$(elem).popover({
   				html: true,
   				content: function(){
   					return "<div class='row'>Price:" + price + "</div><div class = 'row'>" + effect + "</div>"; 
   				},
   				title: function(){
   					return name;
   				}
   			});
   		}
   	}   	
});