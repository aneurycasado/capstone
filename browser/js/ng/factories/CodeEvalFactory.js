app.factory('CodeEvalFactory', (EventFactory, $rootScope, PlayerFactory) => {
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
        let name = tower.codeSnippet.match(/^function\s*(\w+)?/)[1];
        let funcStr = tower.codeSnippet.replace(/^function\s*\w*\s*\((\w+,\s*)*\w*\)\s*\{/, '').replace(/\}$/, '');

        try {
            let newFunc = new Function(funcStr);
            if(name) PlayerFactory.codeSnippets[name] = newFunc;
            let objProvided = assignObjForContext(tower.mods);
            objProvided.surroundings.getCurrentTarget = tower.getCurrentTarget.bind(tower);
            objProvided.surroundings.setTarget = tower.setTargetBasedOnIndex.bind(tower);
            let userSnippets = Object.keys(PlayerFactory.codeSnippets);
            for(let i=0; i < userSnippets.length; i++) {
                objProvided[userSnippets[i]] = PlayerFactory.codeSnippets[userSnippets[i]];
            }
            console.log('objProvided', objProvided);
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

    //let evalGobalSnippet = function(codeSnippet) {
    //    let funcStr = codeSnippet.match(/\s*function\s*\w*\s*\{\w*\s*\w*\}/)
    //    let funcStr = codeSnippet.split(/\}\s*\n+\s*\{/)
    //}
    return {
        evalSnippet
    }
})
