app.factory('CodeEvalFactory', function() {
    let evalSnippet = function() {
        if(!this.codeSnippet) return;
        let newArg = this.codeSnippet.match(/\(context\)/)[0].replace('(', '').replace(')', '');
        let newFunc = this.codeSnippet.replace(/^function\s*\(context\)\s*\{/, '').replace(/}$/, '');
        let targetFunc = new Function(newArg, newFunc);
        this.targetingFunction = () => {
            return targetFunc.call(null, {
                getCurrentTarget: this.getCurrentTarget.bind(this),
                getEnemies: this.getEnemies.bind(this),
                setTarget: this.setTargetBasedOnIndex.bind(this),
                getNearbyTowers: this.getNearbyTowersEncapsulated.bind(this)
            });
        };
    }
    return
})
