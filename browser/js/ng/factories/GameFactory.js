'use strict'
app.factory('GameFactory', function($rootScope, InputFactory, LightningFactory, WaveFactory, EnemyFactory, PlayerFactory, ParticleFactory, MapFactory, ProjectileFactory, StateFactory, TowerFactory) {

    let data = StateFactory;
    let loop = then => {
        //console.log(data.mode);
        let now = Date.now();
        let delta = (now - then) / 1000;

        if(StateFactory.sloMo){
            delta = delta/StateFactory.sloMoMod;
        }

        if (data.state === "selection") {
            //more logic
        }

        if (data.state === "standby") {
            ProjectileFactory.updateAll(delta);
            EnemyFactory.updateAll(delta);
            //put in standby logic
            TowerFactory.updateAll(delta);

        }
        if (data.state === "wave") {
            WaveFactory.update();
            ProjectileFactory.updateAll(delta);
            EnemyFactory.updateAll(delta);

            if((EnemyFactory.enemies.length === 0) && !WaveFactory.currentWaveLength()) {
                if(WaveFactory.endOfWaves()) {
                    changeStateTo('standby');
                } else {
                    changeStateTo("complete");
                }
            } else if(PlayerFactory.health <= 0){
                changeStateTo('gameOver');
            }


            TowerFactory.updateAll(delta);


        }
        if(data.loadGame){
            $rootScope.$emit("loadGame");
            data.loadGame = false;
        }
        // if (data.state === 'complete') {

        // }
        // if (data.state === 'editing') {

        // }
        // if(data.state === 'gameOver'){
        InputFactory.check();

        if( data.state !== "paused" ) StateFactory.setTimeoutsCheck(delta);

        StateFactory.renderer.render(StateFactory.stages.play); //FIXME: should be StateFactory.stages[StateFactory.state]
        requestAnimationFrame(loop.bind(null, now));

    };
    let changeStateTo = (state) => {
        if(state === 'wave') {
            WaveFactory.setCurrentWave();
        }
        if(state === 'complete') {
            $rootScope.$emit('wavesDone');
        }
        if(state === 'standby') {
            $rootScope.$emit('nextWave');
        }
        // if(state === 'editing') {

        // }
        if(state === 'gameOver'){
            $rootScope.$emit('gameOver');
        }
        if(state === "paused"){

        }


        StateFactory.state = state;
    }

    let oldState = null;

    let pause = function(){

        if(StateFactory.state !== "paused") oldState = StateFactory.state;
        changeStateTo("paused");
    }
    let resume = function(){
        StateFactory.state = oldState;
    }
    return {
        pause,
        resume,
        changeStateTo,
        loop
    }
});

