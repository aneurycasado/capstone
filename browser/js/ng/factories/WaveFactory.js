app.factory('WaveFactory', function(EnemyFactory, StateFactory) {
    let createWave = critterObjArr => {
        let wave = []
        critterObjArr.forEach(element => {
            for(let i = 0; i < element.num; i++) {
                wave.push(element.name);
            }
        });
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
            let newEn;
            if(Array.isArray(StateFactory.map.path[0])){
                let index = Math.floor(Math.random()*StateFactory.map.path.length);
                newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.path[index]);
            }else{
                newEn = EnemyFactory.createEnemy(popOffNextMonster(), StateFactory.map.path);
            }
            EnemyFactory.stage.addChild(newEn.img);
        }
    };

    let update = () => {
        loadEnemy();
    };

    let waves = [];
    let wavesDefinition = [];
    let randomInt = (min,max) => {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    let generateWave = (waves,numOfWaves) => {
        let wave = [];
        let enemies = ['SmallBugRed', 'SmallBugGreen', 'SmallBugBlue', 'SmallBugYellow', 'BigBugRed' ,'BigBugGreen' ,'BigBugBlue' ,'BigBugYellow' ,'SuperBigBugRed', 'SuperBigBugGreen', 'SuperBigBugBlue', 'SuperBigBugYellow']
        if(waves.length === 0){
            let numOfSmallBugRed = 10;
            wave.push({name:'SmallBugRed', num:numOfSmallBugRed});
        }else if(waves.length === numOfWaves-1){
            wave.push({name:'BossBug', num: '1'});
        }else{
            let totalEnemies = waves.length * 10;
            let percentages = makePercentages(waves,enemies,numOfEnemies);
            
            enemies.forEach(function(enemy){
                wave.push({name: enemy,num: numOfEnemies*percentages[enemy]});
            })
        }
        return wave;
    }
    let makePercentages = (waves,enemies,numOfEnemies) => {
        let percentages = {};
        enemies.forEach((enemy) =>{
            percentages[enemy] = findPercentage(enemy,waves,numOfEnemies);
        })
        return percentages;
    }
    let findPercentage = (enemy,waves,numOfEnemies) => {
        if(waves.length < 5){
            


        }

    }


    //     let numOfTrojanHorse = randomInt(min,max);
    //     let numOfBigBug = randomInt(min,max);
    //     let numOfBossBug = randomInt(min,max);
    //     while(numOfTrojanHorse > 0 && numOfBigBug > 0 && numOfBossBug > 0){
    //         let currentAnimal = randomInt(1,3);
    //         if(currentAnimal === 1){
    //             if(numOfTrojanHorse === 0) continue;
    //             else{
    //                wave.push({name: 'TrojanHorse', num: 1});
    //                numOfTrojanHorse--;
    //             }
    //         }else if(currentAnimal === 2){
    //             if(numOfBigBug === 0) continue;
    //             else{
    //                 wave.push({name: 'BigBug', num: 1});
    //                 numOfBigBug--;
    //             }
    //         }else if(currentAnimal === 3){
    //             if(numOfBossBug === 0) continue;
    //             else{
    //                 wave.push({name: 'BossBug', num: 1})
    //                 numOfBossBug--;
    //             }
    //         }
    //     }
    // }

    let createWaves = () => {
        let waves = [];
        let numOfWaves = 10;
        for(let i = 0; i < numOfWaves; i++){
            let wave = generateWave(waves,numOfWaves);
            waves.push(wave);
        }
        return waves
    }


    let init = () => {
        wavesDefinition = createWaves();
        wavesDefinition.forEach((wave) => {
            createWave(wave);
        });
    }

    wavesDefinition = createWaves();
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
