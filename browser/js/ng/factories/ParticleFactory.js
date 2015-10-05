'use strict'
app.factory('ParticleFactory', function() {

    class ParticleEmitter{
        constructor(cb, stage, imagePaths, config, type, useParticleContainer){

            this.emitter = null;

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

            //collect the textures, now that they are all loaded
            var art;
            if(makeTextures){
                art = [];
                for(var i = 0; i < urls.length; ++i){
                    art.push(PIXI.Texture.fromImage(imagePaths[i]));
                }
            }else
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
                this.emitter.particleConstructor = cloudkid.PathParticle;
            else if(type == "anim")
                this.emitter.particleConstructor = cloudkid.AnimatedParticle;

            return this.emitter;

        };
    }

    var createFire = function(container, cb){
        return new ParticleEmitter(cb,
            container,
            ['images/particles/1.png'],
            {
                "alpha": {
                    "start": 1,
                    "end": 1
                },
                "scale": {
                    "start": 1,
                    "end": 1,
                    "minimumScaleMultiplier": 1.08
                },
                "color": {
                    "start": "#fff191 ",
                    "end": "#ff622c "
                },
                "speed": {
                    "start": 494,
                    "end": 500
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "startRotation": {
                    "min": 265,
                    "max": 275
                },
                "rotationSpeed": {
                    "min": 55,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.001,
                    "max": 0.001
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": -1,
                "maxParticles": 1000,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "ring",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 9,
                    "minR": 0
                }
            }
        );
    };


    var createDamageSparks = function(container, cb){
        return new ParticleEmitter(cb,
            container,
            ['images/particles/3.png'],
            {
                "alpha": {
                    "start": 1,
                    "end": 1
                },
                "scale": {
                    "start": 0.5,
                    "end": 0.7,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#f8ffad ",
                    "end": "#fff712 "
                },
                "speed": {
                    "start": 700,
                    "end": 700
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "startRotation": {
                    "min": 225,
                    "max": 320
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 500
                },
                "lifetime": {
                    "min": 0.031,
                    "max": 0.07
                },
                "blendMode": "normal",
                "frequency": 0.063,
                "emitterLifetime": -1,
                "maxParticles": 50,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": false,
                "spawnType": "rect",
                "spawnRect": {
                    "x": 0,
                    "y": 0,
                    "w": 5,
                    "h": 0
                }
            }
        
        )};


    return {
        createFire,
        createDamageSparks
    }
})

