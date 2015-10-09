app.factory('SpriteGenFactory', function(StateFactory) {
    let attachSprite = (obj, spriteObj) => {
        obj.img = spriteObj;
        obj.img.interactive = true;
        obj.img.position.x = obj.position.x * StateFactory.cellSize + (StateFactory.cellSize / 2);
        obj.img.position.y = obj.position.y * StateFactory.cellSize + (StateFactory.cellSize / 2);
        obj.img.anchor.x = .5;
        obj.img.anchor.y = .5;
    }

    return {
        attachSprite
    }
})
