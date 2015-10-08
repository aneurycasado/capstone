'use strict'
app.factory('ParticleFactory', function() {

    class ParticleEmitter{
        constructor(stageIn, imagePaths, config, type, useParticleContainer){
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
            
            stageIn.addChild(emitterContainer);

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
                    "start": 0.62,
                    "end": 0
                },
                "scale": {
                    "start": 0.02,
                    "end": 0.5,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fff191 ",
                    "end": "#ff622c "
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
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.02,
                    "max": 0.02
                },
                "blendMode": "normal",
                "frequency": 0.001,
                "emitterLifetime": 2000,
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
                    "r": 4
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
            },

            flame: {
                "alpha": {
                    "start": 0.62,
                    "end": 0
                },
                "scale": {
                    "start": 0.25,
                    "end": 0.75,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fff191 ",
                    "end": "#ff622c "
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
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.1,
                    "max": 0.25
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
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 10
                }
            },


            fire2 : {
                "alpha": {
                    "start": 0.6,
                    "end": 0
                },
                "scale": {
                    "start": 0.66,
                    "end": 0.2,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fff399",
                    "end": "#a62c00"
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
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.091,
                    "max": 0.091
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
                "spawnType": "burst",
                "particlesPerWave": 2,
                "particleSpacing": 0,
                "angleStart": 0
            },

            critter1pieces : {
                "alpha": {
                    "start": 1,
                    "end": 0.41
                },
                "scale": {
                    "start": 1,
                    "end": 1,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#ffffff",
                    "end": "#ffffff"
                },
                "speed": {
                    "start": 300,
                    "end": 300
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
                    "min": 1000,
                    "max": 1000
                },
                "lifetime": {
                    "min": 5,
                    "max": 5
                },
                "blendMode": "normal",
                "frequency": 0.002,
                "emitterLifetime": .009,
                "maxParticles": 4,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": true,
                "spawnType": "rect",
                "spawnRect": {
                    "x": 0,
                    "y": 0,
                    "w": 30,
                    "h": 30
                }
            },

            bigFire: {
                "alpha": {
                    "start": 0.6,
                    "end": 0
                },
                "scale": {
                    "start": 0.66,
                    "end": 0.2,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#fff399 ",
                    "end": "#a62c00 "
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
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.091,
                    "max": 0.091
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
                "spawnType": "burst",
                "particlesPerWave": 2,
                "particleSpacing": 0,
                "angleStart": 0
            },

            lightningBall: {
                "alpha": {
                    "start": 0.55,
                    "end": 0
                },
                "scale": {
                    "start": 0.1,
                    "end": 0.1,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#ffffff",
                    "end": "#ffffff"
                },
                "speed": {
                    "start": 0,
                    "end": 0
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
                    "min": 0.01,
                    "max": 0.01
                },
                "blendMode": "screen",
                "frequency": 0.0001,
                "emitterLifetime": -1,
                "maxParticles": 300,
                "pos": {
                    "x": 0,
                    "y": 0
                },
                "addAtBack": true,
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 6
                }
            },

            meteor: {
                "alpha": {
                    "start": 1,
                    "end": 0.34
                },
                "scale": {
                    "start": 2,
                    "end": 0.001,
                    "minimumScaleMultiplier": 1
                },
                "color": {
                    "start": "#8f1d00",
                    "end": "#ffb545"
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
                    "min": 50,
                    "max": 50
                },
                "lifetime": {
                    "min": 0.1,
                    "max": 0.75
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
                "spawnType": "circle",
                "spawnCircle": {
                    "x": 0,
                    "y": 0,
                    "r": 0
                }
            }
    };



    var particleImageTable = {
        fire: [1, 2],
        ice: [3],
        poison: [4],
        damageSparks: [5],
        flame: [1, 6],
        fire2: [1, 2],
        lightningBall:['lightning1', 'lightning2', 'HardCircle'],
        critter1pieces : ["core1", "wing1", "eye1", "ball1"],
        meteor: [1,2],
    };

    let createEmitter = (emitterType, container, imageArr) => {
        if(!imageArr) imageArr = particleImageTable[emitterType];
        return new ParticleEmitter(
            container,
            imageArr.map((particleNumber) => {
                return 'images/particles/' + particleNumber + '.png';
            }),
            particles[emitterType]
        );

    };

    return {
        createEmitter
    }
})
