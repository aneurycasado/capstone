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
    // let randomInt = (min, max) => {
    //     return Math.floor(Math.random()*(max-min+1)+min);
    // } 
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
            var newEn
            if(Array.isArray(StateFactory.map.path[0])){
                console.log("Load enemy multiple paths");
                console.log("Length",StateFactory.map.path[0].length)
                var index = Math.floor(Math.random()*StateFactory.map.path.length);
                console.log("Index ", index);
                console.log("Path",StateFactory.map.path[index]);
                newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.path[index]);
            }else{
                newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.path);
            }
            console.log("Load Enemy, ", newEn);
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
            waves.push(wave);
        }
        return waves
    }


    let init = () => {
        wavesDefinition = createWaves(); //[[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
        wavesDefinition.forEach(function(wave,i){
            createWave(wave);
        });
    }
       
    wavesDefinition = createWaves(); //[[{name: 'trojanHorse', num: 1}], [{name: 'trojanHorse', num: 1}]];
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
