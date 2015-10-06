app.factory('WaveFactory', function(EnemyFactory, StateFactory) {
    let createWave = critterObjArr => {
        let wave = []
        critterObjArr.forEach(element => {
            for(var i = 0; i < element.num; i++) {
                wave.push(element.name);
            }
        });
        console.log("Wave in createWave", wave);
        waves.push(wave);
    };
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
    let randomInt = function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    let createWaves = function(){
        let waves = [];
        let min = 1; 
        let max = 30;
        let numOfWaves = randomInt(min,max);
        for(let i = 0; i < numOfWaves; i++){
            let wave = [];
            let numOfTrojanHorse = randomInt(min,max);
            let numOfBigBug = randomInt(min,max);
            let numOfBossBug = randomInt(min,max);
            while(numOfTrojanHorse > 0 && numOfBigBug > 0 && numOfBossBug > 0){
                let currentAnimal = randomInt(1,3);
                if(currentAnimal === 1){
                    if(numOfTrojanHorse === 0) continue;
                    else{
                       wave.push({name: 'trojanHorse', num: 1});
                       numOfTrojanHorse--; 
                    } 
                }else if(currentAnimal === 2){
                    if(numOfBigBug === 0) continue;
                    else{
                        wave.push({name: 'bigBug', num: 1});
                        numOfBigBug--;
                    }
                }else if(currentAnimal === 3){
                    if(numOfBossBug === 0) continue;
                    else{
                        wave.push({name: 'bossBug', num: 1})
                        numOfBossBug--;
                    }
                }
            }
            console.log("New wave ", wave);
            waves.push(wave);
        }
        console.log("Waves in createWaves", waves);
        return waves
    }


    let init = () => {
        wavesDefinition = createWaves(); //[[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
        console.log("Waves from createWaves in init", wavesDefinition);
        wavesDefinition.forEach(function(wave,i){
            createWave(wave);
        });
        console.log("Waves in Waves factory init", waves);
    }
       
    wavesDefinition = createWaves(); //[[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
    wavesDefinition.forEach(function(wave,i){
        createWave(wave);
    });
    console.log("Waves in Waves factory", waves);
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
