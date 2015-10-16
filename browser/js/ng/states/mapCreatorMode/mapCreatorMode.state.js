app.config(($stateProvider) => {
    $stateProvider
        .state('mapCreatorMode', {
            url: '/mapCreatorMode',
            templateUrl: '/js/ng/states/mapCreatorMode/mapCreatorMode.state.html',
            controller: 'MapCreatorModeController'
        })
});

app.controller("MapCreatorModeController", ($scope, $rootScope, $state, StateFactory, SpriteEventFactory, MapElementFactory, MapFactory, DesignFactory) => {
    document.getElementsByTagName('body')[0].style.backgroundImage="url(./images/bg2.png)"
    let blankMap = new MapFactory.Map(DesignFactory.blankMap2,0)
    StateFactory.map = blankMap;
    StateFactory.canvas = document.getElementById("stage");
    StateFactory.renderer = PIXI.autoDetectRenderer(StateFactory.width, StateFactory.height, StateFactory.canvas);
    $("#mainContainer").append(StateFactory.renderer.view);
    $(StateFactory.renderer.view).attr("id","pixiCanvas");
    StateFactory.stages.newMap = new PIXI.Stage();
    let bg = new PIXI.Sprite(PIXI.Texture.fromImage("/images/bg.png"));
    bg.interactive = true;
    bg.click = SpriteEventFactory.bgClickHandler;
    bg.width = StateFactory.width;
    bg.height = StateFactory.height;
    StateFactory.stages.newMap.addChild(bg);//yaaaas
    StateFactory.stages.newMap.addChild(blankMap.stage);
    StateFactory.stages.newMap.addChild(MapElementFactory.stage);
    $rootScope.$on('mapElementClicked', function(event, data){
        $scope.mapElementClicked = data;
        console.log("Data in mapElementClicked Event",data);
        $scope.$digest();
    });
    $rootScope.$on("mapElementRemoved", function(event,data){
        $scope.$digest();
    });
    $rootScope.$on("mapElementClickOff", function(event,data){
        $scope.mapElementClicked = null;
        $scope.$digest();
    });
    $("#pixiCanvas").on('click', (e) => {
        if ($scope.currentElement !== null) {
            let elementPositionX = Math.floor(e.offsetX / StateFactory.cellSize);
            let elementPositionY = Math.floor(e.offsetY / StateFactory.cellSize);
            let selectedGridNode = StateFactory.map.grid[elementPositionY][elementPositionX];
            if (!selectedGridNode.contains.element) {
                MapElementFactory.createMapElement(elementPositionX, elementPositionY, $scope.currentElement);
            }
            else {
                console.log("Can't play");
            }
        }
        if($scope.currentElement.name !== "path"){
            $scope.currentElement = null;
            document.getElementsByTagName('body')[0].style.cursor = "default";
        } 
        $scope.$digest();
    })
    const draw = () => {
        requestAnimationFrame(draw);
        StateFactory.renderer.render(StateFactory.stages.newMap);
    }
    draw();
})
