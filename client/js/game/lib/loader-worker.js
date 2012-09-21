onmessage = function(msg) {
    postMessage({ event: 'log', data: msg.data });
    switch(msg.data.event) {
        case 'load':
            doLoad(msg.data.data);
            break;
    }
};

function doLoad(url) {
    doAjax({
        method: 'GET',
        url: url,
        dataType: 'json',
        load: function() {
            postMessage({ event: 'success', data: this.responseText, url: url });
        },
        error: function() {
            postMessage({ event: 'error', data: 'XHR Error', url: url });
        },
        complete: function() {
            postMessage({ event: 'complete', data: 'XHR Completed', url: url });
        },
        abort: function() {
            postMessage({ event: 'error', data: 'XHR Abort', url: url });
        },
        progress: function(e) {
            if(e.lengthComputable) {
                postMessage({ event: 'progress', data: { loaded: e.loaded, total: e.total }, url: url });
            }
            else {
                postMessage({ event: 'error', data: 'Progress not computable', url: url });
            }
        }
    });
};

function doAjax(sets) {
    sets = sets || {};
    sets.method = sets.method || 'GET';
    sets.dataType = sets.dataType || 'json';
    
    var req = new XMLHttpRequest();
    
    req.addEventListener('progress', reqWrap(req, sets.progress), false);
    req.addEventListener('load', reqWrap(req, sets.load), false);
    req.addEventListener('error', reqWrap(req, sets.error), false);
    req.addEventListener('abort', reqWrap(req, sets.abort), false);
    req.addEventListener('loadend', reqWrap(req, sets.complete), false);
    
    req.open(sets.method, sets.url, true);
    req.send();
}

function reqWrap(r, cb) {
    return function() { cb.apply(r, arguments) };
}