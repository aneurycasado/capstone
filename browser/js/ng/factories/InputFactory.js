'use strict'
app.factory('InputFactory', function($rootScope, LightningFactory, WaveFactory, EnemyFactory, PlayerFactory, ParticleFactory, MapFactory, ProjectileFactory, StateFactory, TowerFactory) {

	//check for keyInputs
	var inputManager = {};

	inputManager.pressable = {};

	inputManager.keys = [];
	inputManager.mouse = {};

	addEventListener("keydown", function (e) {	
		inputManager.keys[String.fromCharCode(e.keyCode)] = true;
		inputManager.keys[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete inputManager.keys[String.fromCharCode(e.keyCode)];
		delete inputManager.keys[e.keyCode];
	}, false);

	addEventListener("mousedown", function (e) {
		inputManager.mouse.down = true;
		inputManager.mouse.x = e.clientX;
		inputManager.mouse.y = e.clientY;
		inputManager.mouse.collider = {x: e.clientX, y: e.clientY, width: 1, height: 1};
		
	}, false);

	addEventListener("mouseup", function (e) {	
	}, false);

	inputManager.clear = function(){
		inputManager.mouse.down = false;
	}

	inputManager.toCheck = [];

	inputManager.registerKey = function(char, opts){
		
		if(opts.once) inputManager.pressable[char] = true;
		
		var newKey = {char: char, conditions: {}};
		if(opts.once) newKey.once = true;
		else newKey.once = false;
				
		if(opts.on) newKey.on = opts.on;
		if(opts.off) newKey.off = opts.off;
		
		if(opts.onCondition) newKey.conditions.on = opts.onCondition;
		else newKey.conditions.on = function(){return true};
		
		if(opts.offCondition) newKey.conditions.off = opts.offCondition;
		else newKey.conditions.off = function(){return true};
		
		inputManager.toCheck.push(newKey);
	}

	inputManager.check = function(){
		
		this.toCheck.forEach(function(key){

			if( key.char in this.keys ){
				if( key.on && !key.conditions.on() ) return;
				if( key.once && !this.pressable[key.char] ) return;
				this.pressable[key.char] = false;
				if(key.on) key.on();
			}else{
				if( key.off && !key.conditions.off() ) return;
				if( key.once && this.pressable[key.char] ) return;
				this.pressable[key.char] = true;
				if( key.off ) key.off();	
			}
			
		}.bind(this));
	}

	inputManager.changeKey = function(oldKey, newKey){
		
		this.toCheck.forEach(function(key){
			
			if(key.char == oldKey) key.char = newKey; 
		})
	}

	inputManager.registerKey("U", {
		once: true, 
		on: function(){ 


		        setTimeout(function(){
		            var start = new LightningFactory.Yals.Vector2D(150, -100);
		            var end = new LightningFactory.Yals.Vector2D(StateFactory.width, StateFactory.height);

		            lightnings.push( new LightningFactory.BranchLightning(start,end, '#FFFFFF', 6, .03) );
		            enemy.terminate(true);

		        }.bind(this), 250);
				
		        StateFactory.sloMo = true;
		        setTimeout(function() {
		            StateFactory.sloMo = false;
		        }, 8000);


			}, 
		}
	);


	return inputManager;

});


