app.factory('WaveFactory', function(EnemyFactory, StateFactory) {
    let waves = [];
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
    let popOffCurrentWave = () => currentWave.pop();
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
            var newEn = EnemyFactory.createEnemy(popOffCurrentWave(), StateFactory.map.path);
            StateFactory.stages.play.addChild(newEn.img);
        }
    };

    let update = () => {
        console.log(waves);
        loadEnemy();
    };


    return {
        waves,
        update,
        createWave,
        currentWave,
        popOffCurrentWave,
        endOfWaves,
        currentWaveLength,
        setCurrentWave,
    }
});
