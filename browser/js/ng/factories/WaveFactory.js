app.factory('WaveFactory', function() {
    let currentWaveQueue = [];
    let createWave = critterObjArr => {
        critterObjArr.forEach(element => {
            //EnemyFactory.createEnemy(critterObj[key], path);
            for(var i = 0; i < element.num; i++) {
                currentWaveQueue.push(element.name);
            }
        });
    };

    let popOffWaveQueue = () => currentWaveQueue.pop();
    let currWaveQLength = () => currentWaveQueue.length;
    return {
        currWaveQLength,
        createWave,
        popOffWaveQueue
    }
});
