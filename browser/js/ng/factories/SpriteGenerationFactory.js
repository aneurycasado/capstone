app.factory('SpriteGenFactory', function() {
    let attachSprite = (obj, spriteObj, positionX, positionY) => {
        obj.img = spriteObj;
        obj.img.interactive = true;
        obj.img.position.x = positionX;
        obj.img.position.y = positionY;
        obj.img.pivot.x = .5;
        obj.img.pivot.y = .5;
        obj.img.anchor.x = .5;
        obj.img.anchor.y = .5;
    }

    let attachToContainer = (container, ...sprites) => {
        sprites.forEach(sprite => {
            container.addChild(sprite);
        })
    }
    return {
        attachSprite,
        attachToContainer
    }
})
