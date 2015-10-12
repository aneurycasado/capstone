app.factory('SpriteGenFactory', () =>  {
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

    let drawWeaponRangeCircle = (tower, range) => {
      tower.baseRangeCircle = new PIXI.Graphics();
      tower.baseRangeCircle.beginFill(0xFFFF99, .4);
      tower.baseRangeCircle.lineStyle(2, 0xFFFF99);
      tower.baseRangeCircle.drawCircle(tower.img.position.x, tower.img.position.y, range);
    }
    return {
        attachSprite,
        attachToContainer,
        drawWeaponRangeCircle
    }
})
