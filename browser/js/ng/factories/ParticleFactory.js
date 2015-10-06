'use strict'
app.factory('ParticleFactory', function() {

    class ParticleEmitter{
        constructor(stage, imagePaths, config, type, useParticleContainer){

            this.emitter = null;

            // Preload the particle images and create PIXI textures from it
            let urls, makeTextures = false;
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
            let art;
            if(makeTextures){
                art = [];
                for(let i = 0; i < urls.length; ++i){
                    art.push(PIXI.Texture.fromImage(imagePaths[i]));
                }
            }else
                art = imagePaths.art;
              
            // Create the new emitter and attach it to the stage
            let emitterContainer;
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

    let particles = {
        damageSparks:{
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
                "emitterLifetime": 500,
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
            },

            fire: {
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
            },

            poison: {
                "alpha": {
                    "start": 0.4,
                    "end": 0
                },
                "scale": {
                    "start": 0.21,
                    "end": 0.025,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#6bff61 ",
                    "end": "#d8ff4a "
                },
                "speed": {
                    "start": 10,
                    "end": 10
                },
                "acceleration": {
                    "x": 0,
                    "y": 0
                },
                "startRotation": {
                    "min": 0,
                    "max": 360
                },
                "rotationSpeed": {
                    "min": 0,
                    "max": 0
                },
                "lifetime": {
                    "min": 2,
                    "max": 1.8
                },
                "blendMode": "screen",
                "frequency": 0.02,
                "emitterLifetime": -1,
                "maxParticles": 150,
                "pos": {
                    "x": 0.5,
                    "y": 0.5
                },
                "addAtBack": true,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 10
                }
            },

            ice: {
                "alpha": {
                    "start": 1,
                    "end": 0
                },
                "scale": {
                    "start": 0.2,
                    "end": 0.7,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#8fffee ",
                    "end": "#2930ff "
                },
                "speed": {
                    "start": 500,
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
                    "min": 20,
                    "max": 500
                },
                "lifetime": {
                    "min": 0.005,
                    "max": 0.005
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
                    "x": 1,
                    "y": 0,
                    "r": 0,
                    "minR": 0
                }
            }
    };

    let createEmitter = (emitterType, container, arr) => {
        if(!arr) arr = [emitterType];
        else if(typeof arr === 'string') arr = [arr];

        return new ParticleEmitter(
            container,
            arr.map((item) => {
                return 'images/particles/' + item + '.png';
            }),
            particles[emitterType]
        );

    };

    return {
        createEmitter
    }
})

