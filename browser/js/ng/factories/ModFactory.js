app.factory('ModFactory', function() {
    class CoolDownTimer {
        constructor(coolDownPeriod) {
            this.coolDownPeriod = coolDownPeriod;
            this.currentCoolDown = 0;
        }
        checkCoolDownPassed() {
            return this.currentCoolDown  <= 0;
        }
        decrementCoolDown(delta) {
            this.currentCoolDown -= delta;
        }
        resetCoolDown() {
            this.currentCoolDown = this.coolDownPeriod;
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
        constructor(name, functionToRun, context, coolDownPeriod, purchased=false) {
            super(name, functionToRun, context, purchased);
            this.coolDownTimer = new CoolDownTimer(coolDownPeriod);
        }
        runMod(...newArgs) {
            if(this.coolDownTimer.checkCoolDownPassed()) {
                this.coolDownTimer.resetCoolDown();
                console.log('runMod console.log', this.coolDownTimer.currentCoolDown);
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
