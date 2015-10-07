app.factory('ClickHandlerFactory', function() {
    let selectedTower = null;
    let selectedGrid = null;
    let selectedTowerRemover = () => {
        if(selectedTower) {
            selectedTower.imgContainer.removeChild(selectedTower.baseRangeCircle);
        }
    };

    let towerClickHandler = function(mouseData) {
        selectedTowerRemover();
        this.imgContainer.addChildAt(this.baseRangeCircle, 0);
        selectedTower = this;
    }
    let gridClickHandler = function(mouseData) {
        if(selectedGrid) {
            selectedGrid = this;
        }
        selectedTowerRemover();
    }


    return {
        towerClickHandler,
        gridClickHandler
    }
});
