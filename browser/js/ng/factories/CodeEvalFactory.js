app.factory('CodeEvalFactory', (EventFactory, $rootScope) => {
    let assignObjForContext = function(obj) {
        let keys = Object.keys(obj);
        console.log('keys' , keys);
        let newObj = {};
        for(let i = 0; i < keys.length; i++) {
            newObj[keys[i]] = {};
            obj[keys[i]].forEach(el => {
                if(el.purchased) {
                    newObj[keys[i]][el.name] = el.runMod.bind(el);
                }
            })
        }
        console.log('newObj', newObj);
        return newObj;
    };

    //let bindObjToContext = function(obj, context) {
    //    let outerKeys = Object.keys(obj);
    //    let innerKeys;
    //    //console.log('newKeys', outerKeys);
    //    for(let i = 0; i < outerKeys.length; i++) {
    //        console.log('innerKey', Object.keys(obj[outerKeys[i]]));
    //        innerKeys = Object.keys(obj[outerKeys[i]]);
    //        for(let j = 0; j < innerKeys.length; j++) {
    //            //console.log('obj', obj);
    //            if(typeof obj[outerKeys[i]][innerKeys[j]] === 'function') {
    //                obj[outerKeys[i]][innerKeys[j]] =  obj[outerKeys[i]][innerKeys[j]].bind(context);
    //            }
    //        }
    //    }
    //};

    let evalSnippet = function(tower) {
        if(!tower.codeSnippet) return;
        let funcStr = tower.codeSnippet.replace(/^function\s*\((\w+,\s*)*\w*\)\s*\{/, '').replace(/\}$/, '');

        try {
            let newFunc = new Function(funcStr);
            //console.log('newFunc', newFunc);
            let objProvided = assignObjForContext(tower.mods);
            objProvided.surroundings.getCurrentTarget = tower.getCurrentTarget.bind(tower);
            objProvided.surroundings.setTarget = tower.setTargetBasedOnIndex.bind(tower);
            //objProvided.on = function (name, cb) {
            //    cb = cb.bind(objProvided);
            //    tower.on(name, cb);
            //};
            //objProvided.emit = function (name, cb) {};
            //tower.on('shoot', function () {
            //    objProvided.emit('shoot', data);
            //});
            $rootScope.$broadcast('saveCodeSuccessful', true);
            var runSuccessful = false;
            tower.towerControlFunction = () => {
                try {
                    newFunc.call(objProvided);
                    if(runSuccessful === false) {
                        runSuccessful = true;
                        $rootScope.$broadcast('runtimeSuccessful', tower);
                    }
                } catch(error) {
                    $rootScope.$broadcast('runtimeError', error, tower);
                }
            };
        } catch(error) {
            $rootScope.$broadcast('saveCodeSuccessful', false, error);
        }

    };

    return {
        evalSnippet
    }
})
