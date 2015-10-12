app.config(($stateProvider) => {
    $stateProvider
        .state('mapCreatorMode', {
            url: '/mapCreatorMode',
            templateUrl: '/js/ng/states/mapCreatorMode/mapCreatorMode.state.html',
            controller: 'MapCreatorModeController'
        })
});

app.controller("MapCreatorModeController", ($scope,$state, StateFactory, SpriteEventFactory, MapFactory, DesignFactory) => {
    let blankMap = new MapFactory.Map(DesignFactory.blankMap,0)
    StateFactory.canvas = document.getElementById("stage");
    StateFactory.renderer = PIXI.autoDetectRenderer(StateFactory.width, StateFactory.height, StateFactory.canvas);
    $("#mainContainer").append(StateFactory.renderer.view);
    StateFactory.stages.play = new PIXI.Stage();
    let bg = new PIXI.Sprite(PIXI.Texture.fromImage("/images/bg.png"));
    bg.interactive = true;
    bg.click = SpriteEventFactory.bgClickHandler;
    bg.width = StateFactory.width;
    bg.height = StateFactory.height;
    StateFactory.stages.play.addChild(bg);//yaaaas
    StateFactory.stages.play.addChild(blankMap.stage)
})
