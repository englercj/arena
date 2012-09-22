define(function() {
    var util = {
        spawnWorker: function(script, onMessage, onError) {
            var worker = new Worker(script);

            worker.addEventListener('message', onMessage, false);
            worker.addEventListener('error', onError, false);

            return worker;
        }
    };
    
    return util;
});