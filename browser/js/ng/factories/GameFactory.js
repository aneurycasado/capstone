'use strict'

app.factory('GameFactory', function($rootScope, WaveFactory, EnemyFactory, PlayerFactory, ParticleFactory, MapFactory, ProjectileFactory, StateFactory, TowerFactory) {
    let data = StateFactory;
    let loop = then =>  {
        var now = Date.now();
        var delta = (now - then) / 1000;

        if (data.state == "selection") {
            //more logic
        }
        if (data.state === "standby") {
            //put in standby logic
        }
        if (data.state === "wave") {
            WaveFactory.update();
            ProjectileFactory.updateAll(delta);
            TowerFactory.updateAll(delta);
            EnemyFactory.updateAll(delta);
            
            if(EnemyFactory.enemies.length === 0) {
                if(WaveFactory.endOfWaves()) {
                    changeStateTo('standby');
                } else {
                    changeStateTo("complete");
                }
            }
        }
        if (data.state === 'complete') {

        }
        if (data.state === 'editing') {

        }
        if (data.launchCritters) {
            loadEnemy();
        }
        StateFactory.renderer.render(StateFactory.stages.play); //FIXME: should be StateFactory.stages[StateFactory.state]
        requestAnimationFrame(loop.bind(null, now));
    };
    let changeStateTo = (state) => {
        if(state === 'wave') {
            WaveFactory.setCurrentWave();
            StateFactory.state = "wave";
        }
        if(state === 'complete') {
            $rootScope.$emit('wavesDone');
            StateFactory.state = 'complete';
        }
        if(state === 'standby') {
            //more logic here
            $rootScope.$emit('nextWave');
            StateFactory.state = 'standby';
        }
        if(state === 'editing') {
            //more logic here
            StateFactory.state = 'editing';

        }
    }
    return {
        changeStateTo,
        loop
    }
});

