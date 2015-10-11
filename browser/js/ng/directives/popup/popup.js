app.directive('popover', () => {
   return {
   		restrict: "A",
   		link: (scope,elem) => {
   			let name = scope.tower.name;
   			let price = scope.tower.price;
   			let effect = scope.tower.effect;
   			$(elem).popover({
   				html: true,
   				template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
   				content: () => {
   					return "<div class = 'container'><div class='row'>" + name + " Tower</div><div class='row'>$" + price + "</div><div class = 'row'>" + effect + "</div></div>"
   				},
   			});
   		}
   	}   	
});