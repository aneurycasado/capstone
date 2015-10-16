app.factory('SpriteEventFactory', function($rootScope) {
    let selectedTower = null;
    let selectedGrid = null;
    let buyingTower = false;

    $rootScope.$on('currentTower', function() {
        buyingTower = true;
    });

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
        if(typeof this.terrain === 'string' && buyingTower) {
            var filter = new PIXI.filters.ColorMatrixFilter();
            filter.matrix = [
                1,0,0,0,
                0,2,0,0.5,
                0,0,1,0,
                0,0,0,1
            ];
            this.img.filters = [filter];
        }
    }
    let gridLeaveHandler = function() {
        this.img.filters = null;
    }

    let towerMouseOverHandler = function() {
        document.body.style.cursor = 'pointer';
    };

    let towerMouseLeaveHandler = function() {
        document.body.style.cursor = 'default';
    };

    let basicTowerClickOff = () => {
        selectedTowerRemover();
        $rootScope.$broadcast('terminalOn', true)
        buyingTower = false;
    }
    let gridClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = this;
        }
        basicTowerClickOff();
    };

    let bgClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = null;
        }
        basicTowerClickOff();
    }

    return {
        towerClickHandler,
        towerMouseOverHandler,
        towerMouseLeaveHandler,
        gridOverHandler,
        gridLeaveHandler,
        gridClickHandler,
        bgClickHandler
    }
});
