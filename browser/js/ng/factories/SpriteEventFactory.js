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

    let towerMouseOverHandler = function() {
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
    };

    let towerMouseLeaveHandler = function() {
        this.imgContainer.removeChild(this.baseRangeCircle);
    };

    let gridClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = this;
        }
        selectedTowerRemover();
    };

    let bgClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = null;
        }
        selectedTowerRemover();
    }

    return {
        towerClickHandler,
        towerMouseOverHandler,
        towerMouseLeaveHandler,
        gridClickHandler,
        bgClickHandler
    }
});
