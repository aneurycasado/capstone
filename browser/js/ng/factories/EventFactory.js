app.factory('EventFactory', function() {
    class Event {
        constructor() {
            this.keyfunctionPairs = {};
        }
        on(name, cb) {
            if(!this.keyFunctionPairs[name]) this.keyFunctionPairs[name] = [];
            this.keyFunctionPairs[name].push(cb);
        }
        emit(name, data) {
            this.keyFunctionPairs[name].forEach(cb => {
                cb(data);
            })
        }
    }

    var shootEvent = new Event();
    return {
        shootEvent
    }
});
