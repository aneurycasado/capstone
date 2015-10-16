app.factory('SpriteEventFactory', function($rootScope) {
    let selectedTower = null;
    let selectedGrid = null;
    let buyingTower = false;
    let selectedMapElement = null;
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

    let mapElementClickHandler = function() {
        selectedMapElement = this;
        $rootScope.$broadcast('mapElementClicked', this);
    }

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

    let mapElementClickOff = () => {
        if(selectedMapElement){
            $rootScope.$broadcast("mapElementClickOff");
        }
    }

    let gridClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = this;
        }
        basicTowerClickOff();
        mapElementClickOff();
    };

    let bgClickHandler = function() {
        if(selectedGrid) {
            selectedGrid = null;
        }
        basicTowerClickOff();
        mapElementClickOff();
    }

    return {
        towerClickHandler,
        mapElementClickHandler,
        towerMouseOverHandler,
        towerMouseLeaveHandler,
        gridOverHandler,
        gridLeaveHandler,
        gridClickHandler,
        bgClickHandler
    }
});
