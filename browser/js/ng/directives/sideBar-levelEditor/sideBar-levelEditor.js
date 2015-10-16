app.directive("sideBarLevelEditor", function(){
    return {
        restrict: "E",
        templateUrl: "js/ng/directives/sideBar-levelEditor/sideBar-levelEditor.html",
        controller: 'SideBarLevelEditorController'
    }
});

app.controller('SideBarLevelEditorController', function($scope, $rootScope, MapElementFactory, DesignFactory) {
	$scope.mapElements = [
		{name: "tile1", imgUrl: "/images/background-tilesets/01.png", mapNum: 6},{name: "tile2", imgUrl: "/images/background-tilesets/02.png", mapNum: 6},
		{name: "tile3", imgUrl: "/images/background-tilesets/03.png", mapNum: 6},{name: "detail1", imgUrl: "/images/background-tilesets/08.png", mapNum: 2},
		{name: "detail2", imgUrl: "/images/background-tilesets/09.png", mapNum: 2},{name: "detail3", imgUrl: "/images/background-tilesets/10.png", mapNum: 2},
		{name: "lights1", imgUrl: "/images/background-tilesets/04.png", mapNum: 5},{name: "lights2", imgUrl: "/images/background-tilesets/05.png", mapNum: 5},
		{name: "lights3", imgUrl: "/images/background-tilesets/06.png", mapNum: 5},{name: "lights4", imgUrl: "/images/background-tilesets/07.png", mapNum: 5},
		{name: "panelBottom", imgUrl: "/images/background-tilesets/15.png", mapNum: 7},{name: "panelTop", imgUrl: "/images/background-tilesets/14.png", mapNum: 8},
		{name: "platormBL", imgUrl: "/images/background-tilesets/17.png", mapNum: "BL"},{name: "platformUL", imgUrl: "/images/background-tilesets/18.png", mapNum: "UL"},
		{name: "platormBR", imgUrl: "/images/background-tilesets/19.png", mapNum: "BR"},{name: "platormUR", imgUrl: "/images/background-tilesets/20.png", mapNum: "UR"},
		{name: "platormH", imgUrl: "/images/background-tilesets/21.png", mapNum: "H"},{name: "platormV", imgUrl: "/images/background-tilesets/22.png", mapNum: "V"},
		{name: "platormX", imgUrl: "/images/background-tilesets/16.png", mapNum: "X"},{name: "hanger", imgUrl: "/images/background-tilesets/23.png", mapNum: 4},
		{name: 'path', imgUrl: "/images/background-tilesets/p.png", mapNum: 1}, {name: "base1", imgUrl: "/images/background-tilesets/12.png", mapNum: 3}
	]
	$scope.elementClicked = (element) => {
		document.getElementsByTagName('body')[0].style.cursor= "url("+element.imgUrl+") 20 20, crosshair";
		$scope.currentElement = element;
	}
	$scope.saveMap = () => {
		let newMapGrid = $.extend(true, [], DesignFactory.blankGrid);
		console.log("DesignFactory", DesignFactory.blankGrid);
		console.log("the new map grid", newMapGrid);
		let mapElements = MapElementFactory.mapElements;
		console.log("the map elements", mapElements);
		mapElements.forEach((element) => {
			console.log("Element", element);
			let position = element.position;
			newMapGrid[position.y][position.x] = element.mapNum;
		});
		console.log("New map grid", newMapGrid);
		let mapObj = {};
		newMapGrid.forEach((row,index) => {
			mapObj[index] = row;
		})
		console.log("newMapGrid", newMapGrid);
		console.log("The mapObj", mapObj);
		let stringifyMap = JSON.stringify(mapObj);
		MapElementFactory.createMap(stringifyMap).then((savedMapGrid) => {
			console.log("Map saved string", savedMapGrid.map);
			console.log("Map saved json", JSON.parse(savedMapGrid.map));
		});
	}
});



