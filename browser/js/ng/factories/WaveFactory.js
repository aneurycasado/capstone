app.factory('WaveFactory', ($rootScope,EnemyFactory, StateFactory) => {
    let waves = [];
    const createWave = critterObjArr => {
        let wave = []
        critterObjArr.forEach(element => {
            for(let i = 0; i < element.num; i++) {
                wave.push(element.name);
            }
        });
        waves.push(wave);
    };
    let currentWave;
    const setCurrentWave = () => {
        currentWave = waves.shift();
    }
    const popOffNextMonster = () => currentWave.pop();
    const currentWaveLength = () => currentWave.length;
    const endOfWaves = () => !!waves.length;
    const checkNodeClear = nodeNum => {
        if(!EnemyFactory.enemies.length) return true;
        return EnemyFactory.enemies[EnemyFactory.enemies.length - 1].pathIndex === nodeNum;
    };
    const loadEnemy = () => {
        if(checkNodeClear(3)) {
            if(!currentWaveLength()) return;
            let newEn;
            newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.paths);
            EnemyFactory.stage.addChild(newEn.img);
        }
    };
    const update = () => {
        loadEnemy();
    };
    let wavesDefinition = [];
    const randomInt = (min,max) => {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    const createWaves = () => {
        // let mode = StateFactory.mode;
        let newWaves = [];
        let numOfWaves = 50;
        // if(mode === "survival"){
        //      numOfWaves = 1000;
        // }else{
        //     numOfWaves = 10;
        // }
        for(let i = 1; i <= numOfWaves; i++){
            let wave = generateWaveSurvival(newWaves,numOfWaves);
            newWaves.push(wave);
        }
        return newWaves;
    }
    const generateWaveSurvival = (newWaves,numOfWaves) => {
        let wave = [];
        let enemies = ['SmallBugRed', 'SmallBugGreen', 'SmallBugBlue', 'SmallBugYellow', 'BigBugRed' ,'BigBugGreen' ,'BigBugBlue' ,'BigBugYellow' ,'SuperBigBugRed', 'SuperBigBugGreen', 'SuperBigBugBlue', 'SuperBigBugYellow']
        let numOfEnemies = (newWaves.length + 1) * 20;
        if(newWaves.length <= (numOfWaves / 10)){
            for(let i = 0; i < numOfEnemies; i++){
                // let enemyindex = randomInt(0,3);
                // let enemy = enemies[enemyindex];
                // wave.push({name: enemy, num:1});
                wave.push({name: "EnemyShip", num:1});
            }
        }else if(newWaves.length >= (numOfWaves / 10) && newWaves.length < (numOfWaves / 5)){
             for(let i = 0; i < numOfEnemies; i++){
                let enemyindex = randomInt(0,7);
                let enemy = enemies[enemyindex];
                wave.push({name: enemy, num:1})
            }
        }else if(newWaves.length === numOfWaves-1){
            //wave.push({name: "SmallBugRed", num:1});
            wave.push({name: "BossBug", num:1});
        }else{
            for(let i = 0; i < numOfEnemies; i++){
                let enemyindex = randomInt(0,enemies.length-1);
                let enemy = enemies[enemyindex];
                wave.push({name: enemy, num:1})
            }
        }
        return wave;
    }

    const init = () => {
        waves.length = 0;
        wavesDefinition = createWaves();
        wavesDefinition.forEach((wave) => {
            createWave(wave);
        });
    }

    const loadWaves = (currentWaveNum) => {
        console.log("Before in WaveFactory", waves.length);
        waves.splice(0,currentWaveNum+1); 
        console.log("After in WaveFactory", waves.length);
        setCurrentWave();
    }

    wavesDefinition = createWaves();
    wavesDefinition.forEach((wave) => {
        createWave(wave);
    });
    return {
        init,
        waves,
        loadWaves,
        update,
        createWave,
        currentWave,
        popOffNextMonster,
        endOfWaves,
        currentWaveLength,
        setCurrentWave,
    }
});
