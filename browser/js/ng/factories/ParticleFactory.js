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

            // // Calculate the current time
            // var elapsed = Date.now();
            
            // var updateId;

            // var counter = 0;

            // // Update function every frame
            // var update = function(){

            //     // Update the next frame
            //     updateId = requestAnimationFrame(update);

            //     var now = Date.now();
            //     emitter.update((now - elapsed) * 0.001);
                            
            //     elapsed = now;
                
            //     // render the stage
            //     renderer.render(stage);
            // };

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
                this.emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

                // Click on the canvas to trigger
                canvas.addEventListener('mouseup', function(e){
                    if(!this.emitter) return;
                    this.emitter.emit = true;
                    this.emitter.resetPositionTracking();
                    this.emitter.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
                });
                
                window.destroyEmitter = function()
                {
                    this.emitter.destroy();
                    this.emitter = null;
                    window.destroyEmitter = null;
                    cancelAnimationFrame(updateId);
                    
                    renderer.render(stage);
                };

                cb(this.emitter);

                console.log("FACTORY", Date.now(), this.emitter);
            });
        };
    }


    var createFire = function(container, cb){
        new Particle(cb,
            container,
            ['images/particles/1.png'],
          {
                "alpha": {
                    "start": 0.8,
                    "end": 0.7
                },
                "scale": {
                    "start": 1,
                    "end": 0.3
                },
                "color": {
                    "start": "e3f9ff",
                    "end": "0ec8f8"
                },
                "speed": {
                    "start": 200,
                    "end": 200
                },
                "startRotation": {
                    "min": 0,
                    "max": 0
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 0
                },
                "lifetime": {
                    "min": 0.8,
                    "max": 0.8
                },
                "frequency": 0.2,
                "emitterLifetime": 0.41,
                "maxParticles": 1000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "burst",
                "particlesPerWave": 8,
                "particleSpacing": 45,
                "angleStart": 0
            }
        );
    }


    return {
        createFire,
    }
})

