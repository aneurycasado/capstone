app.factory('WaveFactory', function() {
    let currentWaveQueue = [];
    let createWave = critterObjArr => {
        critterObjArr.forEach(element => {
            //EnemyFactory.createEnemy(critterObj[key], path);
            for(var i = 0; i < element.key; i++) {
                currentWaveQueue.push(element.name);
            }
        });
    };

    let popOffWaveQueue = () => currentWaveQueue.pop();

    return {
        currentWaveQueue,
        createWave,
        popOffWaveQueue
    }
});
