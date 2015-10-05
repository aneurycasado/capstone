'use strict'
app.factory('GridFactory', function(StateFactory) {
    var grid = [];

    class GridNode {
        constructor(x, y, opts) {
            this.x = x;
            this.y = y;
            this.coords = {x: x * StateFactory.cellSize, y: y * StateFactory.cellSize};
            this.enterable = true;
            this.contains = {};
            this.canPlaceTower = false;
            this.terrain = opts.terrain;
            if (opts) {
                if (opts.img) this.img = new PIXI.Sprite(PIXI.Texture.fromImage("/images/background-tilesets/" + opts.img + ".png"));
                this.img.position.x = this.coords.x;
                this.img.position.y = this.coords.y;
                if (opts.canPlaceTower) this.canPlaceTower = true;
            }
        }
    }

    return {
        GridNode,
        grid
    }
})

