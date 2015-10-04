'use strict'
app.factory('ParticleFactory', function() {

    class Particle{
        constructor(cb, stage, imagePaths, config, type, useParticleContainer){

            var canvas = document.getElementsByTagName("canvas")[0];
            // Basic PIXI Setup
            var rendererOptions =
            {
                view: canvas,
            };
            /*var preMultAlpha = !!options.preMultAlpha;
            if(rendererOptions.transparent && !preMultAlpha)
                rendererOptions.transparent = "notMultiplied";*/
            this.emitter = null;

            var renderer = PIXI.autoDetectRenderer(canvas.width, canvas.height, rendererOptions);

            // Preload the particle images and create PIXI textures from it
            var urls, makeTextures = false;
            if(imagePaths.spritesheet)
                urls = [imagePaths.spritesheet];
            else if(imagePaths.textures)
                urls = imagePaths.textures.slice();
            else
            {
                urls = imagePaths.slice();
                makeTextures = true;
            }
            var loader = PIXI.loader;

            for(var i = 0; i < urls.length; ++i){
                loader.add("img" + i, urls[i]);
            }

            loader.load(function()
            {
               
                //collect the textures, now that they are all loaded
                var art;
                if(makeTextures)
                {
                    art = [];
                    for(var i = 0; i < imagePaths.length; ++i)
                        art.push(PIXI.Texture.fromImage(imagePaths[i]));
                }
                else
                    art = imagePaths.art;
                // Create the new emitter and attach it to the stage
                var emitterContainer;
                if(useParticleContainer)
                {
                    emitterContainer = new PIXI.ParticleContainer();
                    emitterContainer.setProperties({
                        scale: true,
                        position: true,
                        rotation: true,
                        uvs: true,
                        alpha: true
                    });
                }
                else
                    emitterContainer = new PIXI.Container();
                stage.addChild(emitterContainer);
                this.emitter = new cloudkid.Emitter(
                    emitterContainer,
                    art,
                    config
                );
                if(type == "path")
                    emitter.particleConstructor = cloudkid.PathParticle;
                else if(type == "anim")
                    emitter.particleConstructor = cloudkid.AnimatedParticle;

                // Center on the stage                
                window.destroyEmitter = function()
                {
                    this.emitter.destroy();
                    this.emitter = null;
                    window.destroyEmitter = null;
                    cancelAnimationFrame(updateId);
                    
                    renderer.render(stage);
                };

                cb(this.emitter);

            });
        };
    }


    var createFire = function(container, cb){
        new Particle(cb,
            container,
            ['images/particles/1.png'],
            {
                    "alpha": {
                        "start": 0.62,
                        "end": 0
                    },
                    "scale": {
                        "start": 0.25,
                        "end": 0.75
                    },
                    "color": {
                        "start": "fff191",
                        "end": "ff622c"
                    },
                    "speed": {
                        "start": 500,
                        "end": 500
                    },
                    "startRotation": {
                        "min": 265,
                        "max": 275
                    },
                    "rotationSpeed": {
                        "min": 50,
                        "max": 50
                    },
                    "lifetime": {
                        "min": 0.1,
                        "max": 0.75
                    },
                    "blendMode": "normal",
                    "frequency": 0.001,
                    "emitterLifetime": 0,
                    "maxParticles": 1000,
                    "pos": {
                        "x": 0,
                        "y": 0
                    },
                    "addAtBack": false,
                    "spawnType": "circle",
                    "spawnCircle": {
                        "x": 0,
                        "y": 0,
                        "r": 10
                    }
            }
        );
    }


    return {
        createFire,
    }
})

