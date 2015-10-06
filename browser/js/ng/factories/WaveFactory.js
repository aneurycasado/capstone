app.factory('WaveFactory', function(EnemyFactory, StateFactory) {
    let createWave = critterObjArr => {
        let wave = []
        critterObjArr.forEach(element => {
            for(var i = 0; i < element.num; i++) {
                wave.push(element.name);
            }
        });
        waves.push(wave);
        console.log("Creating waves ", waves);
    };
    console.log("Waves so far ", waves);
    let currentWave;
    let setCurrentWave = () => {
        currentWave = waves.pop();
    }
    let popOffNextMonster = () => currentWave.pop();
    let currentWaveLength = () => currentWave.length;
    //let removeCurrentWave = () =>{
    //    currentWave = waves.pop();
    //}
    let endOfWaves = () => !!waves.length;

    let checkNodeClear = nodeNum => {
        if(!EnemyFactory.enemies.length) return true;
        return EnemyFactory.enemies[EnemyFactory.enemies.length - 1].pathIndex === nodeNum;
    };


    let loadEnemy = () => {
        if(checkNodeClear(3)) {
            if(!currentWaveLength()) return;

            var newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.path);
            EnemyFactory.stage.addChild(newEn.img);
        }
    };

    let update = () => {
        loadEnemy();
    };

    let waves = [];
    let wavesDefinition = [];

    let init = () => {
        wavesDefinition = [[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
        wavesDefinition.forEach(function(wave,i){
            createWave(wave);
        });
    }
       
    wavesDefinition = [[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
    wavesDefinition.forEach(function(wave,i){
        createWave(wave);
    });

    return {
        init,
        waves,
        update,
        createWave,
        currentWave,
        popOffNextMonster,
        endOfWaves,
        currentWaveLength,
        setCurrentWave,
    }
});
