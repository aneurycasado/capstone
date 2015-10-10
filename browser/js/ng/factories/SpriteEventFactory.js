app.factory('SpriteEventFactory', function($rootScope) {
    let selectedTower = null;
    let selectedGrid = null;
    let selectedTowerRemover = () => {
        if(selectedTower) {
            selectedTower.imgContainer.removeChild(selectedTower.baseRangeCircle);
            $rootScope.$broadcast('setEditing', false);
        }
    };

    let towerClickHandler = function(mouseData) {
        selectedTowerRemover();
        $rootScope.$broadcast('towerClicked', this);
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
        selectedTower = this;
    };

    let towerMouseOverHandler = function(mouseData) {
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
    };

    let towerMouseLeaveHandler = function(mouseData) {
        this.imgContainer.removeChild(this.baseRangeCircle);
    };

    let gridClickHandler = function(mouseData) {
        if(selectedGrid) {
            selectedGrid = this;
        }
        selectedTowerRemover();
    };

    let bgClickHandler = function(mouseData) {
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
