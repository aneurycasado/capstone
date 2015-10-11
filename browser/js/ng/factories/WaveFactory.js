app.factory('WaveFactory', function($rootScope,EnemyFactory, StateFactory) {
    let waves = [];
    let createWave = critterObjArr => {
        let wave = []
        critterObjArr.forEach(element => {
            for(let i = 0; i < element.num; i++) {
                wave.push(element.name);
            }
        });
        waves.push(wave);
    };
    let currentWave;
    let setCurrentWave = () => {
        currentWave = waves.shift();
    }
    let popOffNextMonster = () => currentWave.pop();
    let currentWaveLength = () => currentWave.length;
    let endOfWaves = () => !!waves.length;
    let checkNodeClear = nodeNum => {
        if(!EnemyFactory.enemies.length) return true;
        return EnemyFactory.enemies[EnemyFactory.enemies.length - 1].pathIndex === nodeNum;
    };
    let loadEnemy = () => {
        if(checkNodeClear(3)) {
            if(!currentWaveLength()) return;
            let newEn;
            newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.paths);
            EnemyFactory.stage.addChild(newEn.img);
        }
    };
    let update = () => {
        loadEnemy();
    };
    let wavesDefinition = [];
    let randomInt = (min,max) => {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    let createWaves = () => {
        let mode = StateFactory.mode;
        let waves = [];
        let numOfWaves;
        if(mode === "survival"){
             numOfWaves = 1000;
        }else{
            numOfWaves = 10;
        }
        for(let i = 1; i <= numOfWaves; i++){
            let wave = generateWaveSurvival(waves,numOfWaves);
            waves.push(wave);
        }
        return waves;
    }
    let generateWaveSurvival = (waves,numOfWaves) => {
        let wave = [];
        let enemies = ['SmallBugRed', 'SmallBugGreen', 'SmallBugBlue', 'SmallBugYellow', 'BigBugRed' ,'BigBugGreen' ,'BigBugBlue' ,'BigBugYellow' ,'SuperBigBugRed', 'SuperBigBugGreen', 'SuperBigBugBlue', 'SuperBigBugYellow']
        let numOfEnemies = waves.length * 5;
        if(numOfEnemies === 0) numOfEnemies = 50
        if(waves.length <= (numOfWaves / 10)){
            for(let i = 0; i < numOfEnemies; i++){
                let enemyindex = randomInt(0,3);
                let enemy = enemies[enemyindex];
                wave.push({name: enemy, num:1});
            }
        }else if(waves.length >= (numOfWaves / 10) && waves.length < (numOfWaves / 5)){
             for(let i = 0; i < numOfEnemies; i++){
                let enemyindex = randomInt(0,7);
                let enemy = enemies[enemyindex];
                wave.push({name: enemy, num:1})
            }
        }else if(waves.length === numOfWaves-1){
            wave.push({name: "SmallBugRed", num:1});
            //wave.push({name: "BossBug", num:1});
        }else{
            for(let i = 0; i < numOfEnemies; i++){
                let enemyindex = randomInt(0,enemies.length-1);
                let enemy = enemies[enemyindex];
                wave.push({name: enemy, num:1})
            }
        }
        return wave;
    }

    let init = () => {
        waves.length = 0;
        wavesDefinition = createWaves();
        wavesDefinition.forEach((wave) => {
            createWave(wave);
        });
    }

    wavesDefinition = createWaves(StateFactory.mode);
    wavesDefinition.forEach((wave) => {
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
