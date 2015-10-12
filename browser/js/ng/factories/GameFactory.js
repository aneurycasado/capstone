'use strict'

app.factory('GameFactory', ($rootScope, WaveFactory, EnemyFactory, PlayerFactory, ParticleFactory, MapFactory, ProjectileFactory, StateFactory, TowerFactory) => {
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
        }
        if (data.state === "wave") {
            WaveFactory.update();
            ProjectileFactory.updateAll(delta);
            TowerFactory.updateAll(delta);
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

        // }        
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
        StateFactory.state = state;
    }
    return {
        changeStateTo,
        loop
    }
});

