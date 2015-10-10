app.directive("towerStore", function(){
    return {
        restrict: "E",
        templateUrl: 'js/ng/directives/towerStore/towerStore.html',
        controller: "TowerStoreController"
    }
});

app.controller('TowerStoreController', function($scope){
	console.log("We called TowerStoreController");
	$('.popOverSideBar').popover();
});