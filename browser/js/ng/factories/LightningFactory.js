app.factory('LightningFactory', function(StateFactory) {

    var loadImages = (function () {

        var stack = [],
            imageLoaded = function (image, key, stackIdx) {

                var stackItem = stack[stackIdx];

                ++stackItem.currentLen;

                stackItem.imgs[key] = image;

                if (stackItem.currentLen === stackItem.originalLen) {

                    stackItem.callback(stackItem.imgs);
                    stack.splice(stackIdx, 1);

                }

            };

        return function (imgs, callback) {

            var key, stackItem, idx = stack.length;

            stackItem = {

                currentLen: 0,
                originalLen: 0,
                callback: callback,
                imgs: imgs

            };

            stackItem.originalLen = Object.keys(imgs).length;

            if (stackItem.originalLen === 0) throw new Error('Invalid number of images.');

            stack.push(stackItem);

            for (key in imgs) {

                if (!imgs.hasOwnProperty(key)) continue;


                var img = new Image();
                img.src = imgs[key];

                img.addEventListener('load', (function (key) {

                    return function (event) {

                        imageLoaded(this, key, idx);
                    };

                }(key)), false);

            }

        }

    }());


    var scene = new Yals.Scene(),
        ctx = scene.context,
        mouse = Yals.Mouse.capture(scene.canvasElement),
        game = new Yals.Game(60),
        gameManager = new Yals.GameManager(game),
        $debug = $('#debug'),
        DEGREES_TO_RADIANS = Math.PI / 180;
        // isOperaOrChrome = ($.browser.chrome ? true : ($.browser.opera ? true : false)); //$.browser was removed from jQuery >=1.9

    scene.canvasElement.width = StateFactory.width;
    scene.canvasElement.height = StateFactory.height;
    $(scene.canvasElement).appendTo($("#mainContainer"));


    //this will be used by LightningSegment.prototype.render
    var imgs, capOrigin, middleOrigin, imageThickness = 8, colorCache = [], colorCacheIdx = [], screenMiddle, branchLightning;

    function onImagesLoaded(imgsIn) {

     //this will be used by LightningSegment.prototype.render
        imgs = imgsIn;
        capOrigin = new Yals.Vector2D(imgs.HalfCircle.width, imgs.HalfCircle.height / 2);
        middleOrigin = new Yals.Vector2D(0, imgs.LightningSegment.height / 2);

        var branchLightning = null,
            screenMiddle = new Yals.Vector2D(scene.width / 2, scene.height / 2),
            i, j;

    }

    function Rand(from, to) {

        return (Math.random() * (to - from + 1) + from) | 0; //generate lookup table beforehand?

    }

    function generateTintImage(img, rgbks, red, green, blue) {

        var buffer = document.createElement('canvas'),
            bufferCtx = buffer.getContext('2d');

        buffer.width = img.width;
        buffer.height = img.height;

        bufferCtx.globalAlpha = 1;
        bufferCtx.globalCompositeOperation = 'copy';
        bufferCtx.drawImage(rgbks[3], 0, 0);

        bufferCtx.globalCompositeOperation = 'lighter';

        if (red > 0) {
            bufferCtx.globalAlpha = red / 255.0;
            bufferCtx.drawImage(rgbks[0], 0, 0);
        }
        if (green > 0) {
            bufferCtx.globalAlpha = green / 255.0;
            bufferCtx.drawImage(rgbks[1], 0, 0);
        }
        if (blue > 0) {
            bufferCtx.globalAlpha = blue / 255.0;
            bufferCtx.drawImage(rgbks[2], 0, 0);
        }

        return buffer;
    }

    //Method 2, faster.
    //based on: http://stackoverflow.com/a/4231508/710693
    function tintImage(image, tintColor) {

        //create the offscreen buffers
        var buffer1 = document.createElement('canvas'),
            buffer1Ctx = buffer1.getContext('2d'),
            buffer2 = document.createElement('canvas'),
            buffer2Ctx = buffer2.getContext('2d');

        buffer2.width = buffer1.width = image.width;
        buffer2.height = buffer1.height = image.height;

        //fill buffer1 with the tint color
        buffer1Ctx.fillStyle = tintColor;
        buffer1Ctx.fillRect(0, 0, buffer1.width, buffer1.height);

        //destination atop makes a result with an alpha channel identical to fg
        //but with all pixels retaining their original color
        buffer1Ctx.globalCompositeOperation = "destination-atop";
        buffer1Ctx.drawImage(image, 0, 0);

        //to tint the image, draw it first
        buffer2Ctx.drawImage(image, 0, 0);

        //then set the global alpha to the amound that you want to tint it, and draw the buffer1 directly on top of it.
        buffer2Ctx.globalAlpha = 0.5;
        buffer2Ctx.drawImage(buffer1, 0, 0);

        return buffer2;
    }

    function LightningSegment(startingPoint, endingPoint, thickness) {

        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;
        this.thickness = thickness || 1;

    }

    LightningSegment.prototype.render = function (ctx, color) {

        color = color || '#FFFFFF';

        var startingPoint = this.startingPoint,
            endingPoint = this.endingPoint,
            tangent = endingPoint.getSubtracted(startingPoint),
            rotation = tangent.angle(),
            thicknessScale = this.thickness / imageThickness,
            middleScale = new Yals.Vector2D(tangent.length(), thicknessScale),
            halfCircleImage = imgs.HalfCircle,
            lightningSegment = imgs.LightningSegment;

        if (color !== '#FFFFFF') { //the original image is already white, there is no need to tint

            var idx = colorCacheIdx.indexOf(color);

            if (idx === -1) {

                idx = colorCacheIdx.length;
                colorCacheIdx.push(color);

                colorCache.push(tintImage(imgs.HalfCircle, color));
                colorCache.push(tintImage(imgs.LightningSegment, color));

            }

            //Because Javascript doesn't have assoc arrays, we are going to use two arrays, one for the indices, and the other for the values
            halfCircleImage = colorCache[idx * 2];
            lightningSegment = colorCache[idx * 2 + 1];

        }

        //Time to draw the lightning segment.
        ctx.save();

        ctx.translate(startingPoint.x, startingPoint.y);
        ctx.rotate(rotation);


        //draw the main line segment
        ctx.scale(middleScale.x, middleScale.y);
        ctx.drawImage(lightningSegment, 0, -(lightningSegment.height / 2));


        //draw the left circle
        ctx.scale(1 / middleScale.x, 1 / middleScale.y); //revert the scale
        ctx.scale(thicknessScale, thicknessScale);
        ctx.drawImage(halfCircleImage, -(halfCircleImage.width), -(halfCircleImage.height / 2));


        //draw the right circle
        ctx.scale(1 / thicknessScale, 1 / thicknessScale);
        ctx.rotate(-rotation); //revert rotation, if we dont do that, translate will give us an wrong result.
        ctx.translate(endingPoint.x - startingPoint.x, endingPoint.y - startingPoint.y);
        ctx.rotate(rotation + Math.PI); //rotate for the same amout + 180degrees
        ctx.scale(thicknessScale, thicknessScale);
        ctx.drawImage(halfCircleImage, -(halfCircleImage.width), -(halfCircleImage.height / 2));

        ctx.restore();


    };

    function LightningBolt(startingPoint, endingPoint, color, fadeRate) {

        this.bolt = LightningBolt.createBolt(startingPoint, endingPoint, 1);

        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;

        this.color = color || '#FFFFFF';
        this.alpha = 1;
        this.fadeRate = fadeRate;
        this.alphaMultiplier = 0.6;

    }

    LightningBolt.createBolt = function (startingPoint, endingPoint, thickness) {

        var results = [],
            positions = [],
            tangent = endingPoint.getSubtracted(startingPoint),
            normal = tangent.clone().turnLeft().normalize(),
            length = tangent.length(),
            SWAY = 60,
            JAGGEDNESS = 1 / SWAY,
            prevPoint = startingPoint,
            prevDisplacement = 0,
            i, len;

        positions.push(0);

        for (i = 0, len = length / 4; i < len; i++) {
            positions.push(Math.random());
        }

        positions.sort();

        for (i = 1, len = positions.length; i < len; i++) {

            var pos = positions[i],
                // used to prevent sharp angles by ensuring very close positions also have small perpendicular variation.
                scale = (length * JAGGEDNESS) * (pos - positions[i - 1]),
                // defines an envelope. Points near the middle of the branchLightning can be further from the central line.
                envelope = pos > 0.95 ? 20 * (1 - pos) : 1,
                displacement = Rand(-SWAY, SWAY);

            displacement -= (displacement - prevDisplacement) * (1 - scale);
            displacement *= envelope;

            var point = startingPoint.getAdded(tangent.getScaled(pos).add(normal.getScaled(displacement)));

            results.push(new LightningSegment(prevPoint, point, thickness));

            prevPoint = point;
            prevDisplacement = displacement;

        }

        results.push(new LightningSegment(prevPoint, endingPoint, thickness));

        return results;
    };

    LightningBolt.prototype.isComplete = function () {

        return this.alpha <= 0;
    };

    LightningBolt.prototype.getPoint = function (position) {

        var start = this.startingPoint,
            end = this.endingPoint,
            dist = start.distance(end),
            direction = end.getSubtracted(start).normalize(),
            bolt = this.bolt,
            line;

        position *= dist;

        for (var i = 0, len = bolt.length; i < len; i++) {

            if (bolt[i].endingPoint.getSubtracted(start).dot(direction) >= position) {
                line = bolt[i];
                break;
            }

        }

        var lineStartPos = line.startingPoint.getSubtracted(start).dot(direction),
            lineEndPos = line.endingPoint.getSubtracted(start).dot(direction),
            linePos = (position - lineStartPos) / (lineEndPos - lineStartPos);

        return line.startingPoint.getLerp(line.endingPoint, linePos);
    };

    LightningBolt.prototype.render = function (ctx) {

        if (this.alpha <= 0) return;

        var oldGlobalAlpha = ctx.globalAlpha;

        //we are going to use the globalAlpha property to make the fadeIn
        //its the only *easy* way to fadeIn an image on the canvas.
        ctx.globalAlpha = this.alpha;

        for (var i = 0, len = this.bolt.length; i < len; i++) {

            this.bolt[i].render(ctx, this.color);

        }

        ctx.globalAlpha = oldGlobalAlpha;

    };

    LightningBolt.prototype.update = function () {

        this.alpha -= this.fadeRate;

    };

    function BranchLightning(startingPoint, endingPoint, color, numBranchesIn, fadeRate) {

        this.startingPoint = startingPoint;
        this.endingPoint = endingPoint;

        this.color = color || '#FFFFFF';

        this.direction = endingPoint.getSubtracted(startingPoint).normalize();

        this.bolts = [];

        this._createBranchs(numBranchesIn, fadeRate);

        // lightnings.push(this);

    }

    BranchLightning.prototype._createBranchs = function (numBranchesIn, fadeRate) {

        var mainBolt = new LightningBolt(this.startingPoint, this.endingPoint, this.color, fadeRate),
            bolts = this.bolts,
            numBranches = numBranchesIn || 3,
            fadeRate = fadeRate || .03,
            branchPoints = [],
            i, len;

        bolts.push(mainBolt);

        while (--numBranches) {

            branchPoints.push(Math.random());

        }

        branchPoints.sort();

        for (i = 0, len = branchPoints.length; i < len; i++) {

            // Bolt.GetPoint() gets the position of the lightning branchLightning at specified fraction (0 = start of branchLightning, 1 = end)
            var boltStart = mainBolt.getPoint(branchPoints[i]),
                diff = this.endingPoint.getSubtracted(this.startingPoint),
                shouldInvert;

            // rotate 30 degrees. Alternate between rotating left and right.
            shouldInvert = ((i & 1) == 0 ? 1 : -1);

            //prevents it from branching out, makes all branches end in one point
            shouldInvert = 0;

            diff.scale(1 - branchPoints[i]);

            //if we are going to use Matrix:
            //                var rot = new Yals.Matrix2D( 1, 0, 0, 1, 0, 0 );
            //                rot.rotate( 30 * shouldInvert );
            //
            //                rot.applyToVector( diff );
            //
            //                diff.add( boltStart );

            //or them, the proper method in the Vector object:
            diff.add(boltStart).rotateAroundPivot(boltStart, (30 * shouldInvert) * DEGREES_TO_RADIANS);

            bolts.push(new LightningBolt(boltStart, diff, this.color, fadeRate));
        }

    };

    BranchLightning.prototype.update = function () {

        var bolts = this.bolts;

        for (var i = 0, len = bolts.length; i < len; i++) {

            if (!bolts[i].isComplete()) bolts[i].update();
        }

        if( this.isComplete() ){
            this.complete = true;
            $(StateFactory.renderer.view).css({'z-index' : '2'})
            $(scene.canvasElement).css({'z-index' : '1'});

            // this = undefined;
        } 

    };

    BranchLightning.prototype.isComplete = function(){


        return this.bolts.every(function(bolt){
            return bolt.isComplete();
        });

    }

    BranchLightning.prototype.render = function (ctx) {

        var bolts = this.bolts;

        for (var i = 0, len = bolts.length; i < len; i++) {
            bolts[i].render(ctx);
        }

    };

    loadImages({
        HalfCircle : 'http://dl.dropbox.com/u/3902537/assets/imgs/half-circle-2.png',
        LightningSegment : 'http://dl.dropbox.com/u/3902537/assets/imgs/lightning-segment-2.png'
    }, onImagesLoaded);



  //   let lightnings = []; 

  //     let updateLightnings = function(){

  //     LightningFactory.ctx.clearRect(0, 0, LightningFactory.scene.width, LightningFactory.scene.width);
  //     lightnings = lightnings.filter(function(branch){

  //         if(!branch.complete){
  //             $(StateFactory.renderer.view).css({'z-index' : '1'})
  //             $(LightningFactory.scene.canvasElement).css({'z-index' : '2'});

  //             branch.update();
  //             branch.render(LightningFactory.ctx);
  //             return true;
  //         }else return false;

  //     });

  // }
        

    return { 
        scene,
        Yals,
        BranchLightning,
        ctx,
    };

});