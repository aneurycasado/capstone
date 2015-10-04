app.factory('WaveFactory', function() {
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
        currentWave = waves[waves.length-1];
    }
    let popOffCurrentWave = () => currentWave.pop();
    let currentWaveLength = () => currentWave.length;
    let removeCurrentWave = () =>{
        waves.pop();
        currentWave = waves[waves.length-1];
    } 
    return {
        waves,
        createWave,
        currentWave,
        popOffCurrentWave,
        currentWaveLength,
        removeCurrentWave,
        setCurrentWave,
    }
});
