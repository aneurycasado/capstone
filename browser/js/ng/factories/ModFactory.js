app.factory('ModFactory', function() {
    class CoolDownTimer {
        constructor(coolDownPeriod, time=Date.now()) {
            this.coolDownPeriod = coolDownPeriod;
            this.timesSet = 1;
            this.startTime = time;
        }
        elapsedTime(time=Date.now()) {
            return time - this.startTime;
        }
        checkCoolDownPassed(time=Date.now()) {
            return this.coolDownPeriod  < this.elapsedTime(time);
        }
        checkCoolDownAndReset(time=Date.now()) {
            if(this.checkCoolDownPassed(time)) this.setNewTime(time);
        }
        setNewTime(time=Date.now()) {
            this.startTime = time;
            this.timesSet++;
        }
    }

    class Mod {
        constructor(name, functionToRun, context, purchased=false) {
            this.name = name;
            this.context = context;
            this.functionToRun = functionToRun.bind(context);
            if(typeof purchased === 'boolean') this.purchased=purchased;
            else {
                this.purchased = false;
            }
        }
        buy() {
            this.purchased = true;
        }
        runMod(...newArgs) {
            return this.functionToRun(newArgs);
        }
    }

    class Surrounding extends Mod {
        constructor(name, functionToRun, context, purchased=false) {
            super(name, functionToRun, context, purchased);
        }
    }

    class Ability extends Mod {
        constructor(name, functionToRun, context, coolDownPeriod, purchased=false, time=Date.now()) {
            super(name, functionToRun, context, purchased);
            this.coolDownTimer = new CoolDownTimer(coolDownPeriod, time);
        }
        resetCoolDown() {
            this.coolDownTimer.setNewTime();
        }
        runMod(...newArgs) {
            if(this.coolDownTimer.timesSet === 1 || this.coolDownTimer.checkCoolDownPassed()) {
                console.log('in the if statement');
                this.coolDownTimer.setNewTime();
                return super.runMod(...newArgs);

            }
        }
    }

    class Consumable extends Mod {
      constructor(name, functionToRun, context, quantity=0, purchased=false) {
        super(name, functionToRun, context, purchased);
        this.quantity = quantity;
      }
      addToQuantity() {
        this.quantity++;
      }
      decrementQuantity() {
        this.quantity--;
      }
      runMod(...newArgs) {
        if(this.quantity) {
          this.decrementQuantity();
          return super.runMod(...newArgs);
        }
      }
    }

    class Effect extends Mod {
      constructor(name, functionToRun, context, purchased=false) {
        super(name, functionToRun, context, purchased)
      }
    }


    return {
        Ability,
        Surrounding,
        Consumable,
        Effect,
    }
});
