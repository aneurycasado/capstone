app.factory('CodeEvalFactory', function() {
    let assignObjForContext = function(obj) {
        let keys = Object.keys(obj);
        console.log('keys' , keys);
        let newObj = {};
        for(let i = 0; i < keys.length; i++) {
            newObj[keys[i]] = {};
            obj[keys[i]].forEach(el => {
                if(el.purchased) {
                    newObj[keys[i]][el.name] = el.functionToRun;
                }
            })
        }
        return newObj;
    };

    let bindObjToContext = function(obj, context) {
        let outerKeys = Object.keys(obj);
        let innerKeys;
        console.log('newKeys', outerKeys);
        for(let i = 0; i < outerKeys.length; i++) {
            innerKeys = Object.keys(outerKeys);
            for(let j = 0; j < innerKeys.lenght; j++) {
                obj[i][j] = obj[i][j].bind(context);
            }
        }
    };

    let evalSnippet = function() {
        if(!this.codeSnippet) return;
        let newFunc = this.codeSnippet.replace(/^function\s*\((\w+,\s*)*\w*\)\s*\{/, '').replace(/\}$/, '');
        newFunc = new Function(newFunc);
        let context = assignObjForContext(this.mods);
        context.surroundings.getCurrentTarget = this.getCurrentTarget;
        context.surroundings.setTarget = this.setTargetBasedOnIndex;
        console.log('context', context);
        bindObjToContext(context, this);
        this.towerControlFunction = () => {
            return newFunc.call(context);
        };
    };

    return {
        evalSnippet
    }
})
