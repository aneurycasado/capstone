'use strict'
app.factory('StateFactory', function() {
    let state = {
        width: 800,
        rows: 13,
        cols: 20
    };
    state.mode = "unset";
    state.cellSize =  state.width /  state.cols;
    state.height = state.rows * state.cellSize;
    state.stages = {
        play: new PIXI.Stage(),
        menu: new PIXI.Stage(),
        //standby: new PIXI.Stage(),
        //complete: new PIXI.Stage()
    };

    state.map = null;
    state.sloMoMod = 4;
    state.sloMo = false;
    return state;
});
