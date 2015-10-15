app.factory('SpriteEventFactory', function($rootScope) {
    let selectedTower = null;
    let selectedGrid = null;
    let selectedTowerRemover = () => {
        if(selectedTower) {
            selectedTower.imgContainer.removeChild(selectedTower.baseRangeCircle);
            $rootScope.$broadcast('setEditing', false);
        }
    };
//Removed mouseData from all of these functions for ESLint warings to go away.
    let towerClickHandler = function() {
        selectedTowerRemover();
        $rootScope.$broadcast('towerClicked', this);
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
        selectedTower = this;
    };

    let gridOverHandler = function() {
        if(typeof this.terrain === 'string') {
            var filter = new PIXI.filters.ColorMatrixFilter();
            filter.matrix = [
                1,0,0,0,
                0,2,0,0.5,
                0,0,1,0,
                0,0,0,1
            ];
            console.log(filter.matrix[2]);
            console.log(this.img.filters);
            this.img.filters = [filter];
        }
    }
    let gridLeaveHandler = function() {
        this.img.filters = null;
    }

    //let towerMouseOverHandler = function() {
    //    this.imgContainer.addChildAt(this.baseRangeCircle, 0);
    //};
    //
    //let towerMouseLeaveHandler = function() {
    //    this.imgContainer.removeChild(this.baseRangeCircle);
    //};

    let gridClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = this;
        }
        selectedTowerRemover();
        $rootScope.$broadcast('terminalOn', true)
    };

    let bgClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = null;
        }
        selectedTowerRemover();
        $rootScope.$broadcast('terminalOn', true)
    }

    return {
        towerClickHandler,
        gridOverHandler,
        gridLeaveHandler,
        gridClickHandler,
        bgClickHandler
    }
});
