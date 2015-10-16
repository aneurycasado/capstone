'use strict'
app.factory('StateFactory', function() {
    let state = {
        width: 800,
        rows: 12,
        cols: 20
    };
    state.mode = "unset";
    state.cellSize =  state.width /  state.cols;
    state.height = state.rows * state.cellSize;
    state.stages = {
        play: new PIXI.Stage(),
        menu: new PIXI.Stage(),
        towers: new PIXI.Stage()
        //standby: new PIXI.Stage(),
        //complete: new PIXI.Stage()
    };

    state.map = null;
    state.sloMoMod = 4;
    state.sloMo = false;


        //there be dragons
    state.setTimeouts = [];

    state.setTimeout2 = function(func, time){
    
        state.setTimeouts.push({func: func, time: time});

    }

    state.setTimeoutsCheck = function(delta){

      if(state.state !== "paused"){

            state.setTimeouts = state.setTimeouts.filter(function(timeOut){

                  timeOut.time -= (delta * 1000);

                  if(timeOut.time < 0){
                    timeOut.func();
                    return false;

                  } 

                  return true;

            });

        }

    }
    return state;
});
