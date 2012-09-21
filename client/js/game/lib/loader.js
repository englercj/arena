define([
    'jquery',
    'game/lib/util'
], function($, util) {
    var Loader = Class.extend({
        init: function() {
            //start the loader webworker
            this._worker = util.spawnWorker(
                'js/game/lib/loader-worker.js',
                $.proxy(this, this._onMessage),
                $.proxy(this, this._onError)
            );
            
            this._loading = {};
        },
        load: function(url, opts, cb) {
            if(typeof(opts) == 'function') {
                cb = opts;
                opts = {};
            }
            
            opts = opts || {};
            
            url = url.replace('js/game/', '..');
            url = url.replace('js/', '../..');
            
            this._loading[url] = { cb: cb, prog: opts.prog };
            this._worker.postMessage({ event: 'load', data: url });
            console.log(url, opts, cb, this._loading);
        },
        _onMessage: function(msg) {
            switch(msg.data.event) {
                case 'success': //data was loaded
                    if(this._loading[msg.data.url]) {
                        try {
                            if(this._loading[msg.data.url].cb)
                                this._loading[msg.data.url].cb(null, JSON.parse(e.data.data));
                        } catch(e) {
                            this._loading[msg.data.url].cb(e.message);
                        }
                        
                        delete this._loading[msg.data.url];
                    }
                    break;
                case 'error': //error occurred
                    if(this._loading[msg.data.url] && this._loading[msg.data.url].cb) {
                        this._loading[msg.data.url].cb(msg.data.data);
                    }
                    break;
                case 'complete': //completed a load (could be success or error)
                    break;
                case 'progress': //progress of a load
                    if(this._loading[msg.data.url] && this._loading[msg.data.url].prog) {
                        this._loading[msg.data.url].prog(msg.data.data);
                    }
                    break;
                case 'log':
                    console.log(msg.data.data);
                    break;
            }
        },
        _onError: function(error) {
            console.error('loader error:', error.message);
            throw error;
        }
    });
    
    return Loader;
});