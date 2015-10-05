'use strict'

app.factory('GameFactory', function($rootScope, WaveFactory, EnemyFactory, PlayerFactory, ParticleFactory, MapFactory, GridFactory, ProjectileFactory, StateFactory, TowerFactory) {
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


        //if(GameFactory.nextWave){
        //    GameFactory.nextWave = false;
        //    $rootScope.$emit("nextWave")
        //    $scope.count++;
        //}
        if (data.launchCritters) {
            loadEnemy();
        }
        StateFactory.renderer.render(StateFactory.stages.play); //FIXME: should be StateFactory.stages[StateFactory.state]
        requestAnimationFrame(loop.bind(null, now));
    };
    let changeStateTo = (state) => {
        if(state === 'wave') {
            //if(EnemyFactory.enemies.length === 0 && GameFactory.launchCritters) {
            //    if(endOfWaves()) {
            //        setCurrentWave();
            //        $rootScope.$emit('nextWave');
            //        GameFactory.state = "nextWave";
            //    } else {
            //        GameFactory.state = "completed";
            //    }
            //    GameFactory.launchCritters = false;
            //}
            WaveFactory.setCurrentWave();
            StateFactory.state = "wave";
        }
        if(state === 'complete') {
            $rootScope.$emit('wavesDone');
            StateFactory.state = 'complete';
            //if(data.wavesDone && !sendToNextLevel) {
            //    sendToNextLevel = true;
            //    $rootScope.$emit('wavesDone')
            //}
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

