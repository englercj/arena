var util = {
    spawnWorker: function(script, onMessage, onError) {
        var worker = new Worker(script);
        
        worker.onmessage = onMessage;
        worker.onerror = onError;
        
        return worker;
    }
};

define(util);