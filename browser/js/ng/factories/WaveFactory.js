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
        currentWave = waves.pop();
    }
    let popOffCurrentWave = () => currentWave.pop();
    let currentWaveLength = () => currentWave.length;
    //let removeCurrentWave = () =>{
    //    currentWave = waves.pop();
    //}
    let endOfWaves = () => !!waves.length;

    return {
        waves,
        createWave,
        currentWave,
        popOffCurrentWave,
        endOfWaves,
        currentWaveLength,
        setCurrentWave,
    }
});
