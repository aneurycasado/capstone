app.factory('CodeEvalFactory', function() {
    let assignContext = function() {

    }


    let evalSnippet = function() {
        if(!this.codeSnippet) return;
        let newFunc = this.codeSnippet.replace(/^function\s*\((\w+,\s*)*\w*\)\s*\{/, '').replace(/\}$/, '');
        newFunc = new Function(newFunc);
        this.towerControlFunction = () => {
            return newFunc.call({
                getCurrentTarget: this.getCurrentTarget.bind(this),
                getEnemies: this.getEnemies.bind(this),
                setTarget: this.setTargetBasedOnIndex.bind(this),
                getNearbyTowers: this.getNearbyTowersEncapsulated.bind(this)
            });
        };
    };



    return {
        evalSnippet
    }
})
