app.factory('ClickHandlerFactory', function() {
    let towerClickHandler = function() {
        let highlightedTower;
        return function(mouseData) {
            console.log(highlightedTower);
            if(highlightedTower) {
                console.log(highlightedTower);
                highlightedTower.imgContainer.removeChild(highlightedTower.rangeCircleContainer);
            }
            this.imgContainer.addChildAt(this.rangeCircleContainer, 0);
            highlightedTower = this;
        }
    };
    return {
        towerClickHandler
    }
});
