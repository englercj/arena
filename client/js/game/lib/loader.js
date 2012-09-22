define([
    'jquery',
    'game/lib/util'
], function($, util) {
    var Loader = Class.extend({
        init: function() {
            //start the loader webworker
            this._worker = util.spawnWorker(
                'js/game/lib/loader-worker.js',
                $.proxy(this._onMessage, this),
                $.proxy(this._onError, this)
            );
            
            this._loading = {};
        },
        load: function(url, opts) {
            if(url instanceof Array) {
                for(var i = 0, len = url.length; i < len; ++i) {
                    this.load(url[i], opts);
                }
                return;
            }
            
            opts = opts || {};
            
            url = url.replace('js/game/', '../');
            url = url.replace('js/', '../../');
            
            this._loading[url] = opts;
            this._worker.postMessage({ event: 'load', data: url });
        },
        _onMessage: function(msg) {
            var o = this._loading[msg.data.url];
            
            if(!o) return;
            
            switch(msg.data.event) {
                //data was loaded
                case 'success':
                    if(o.success && typeof(o.success) == 'function') {
                        try {
                                o.success(JSON.parse(msg.data.data), msg.data.url);
                        } catch(e) {
                                o.success(msg.data.data, msg.data.url);
                        }
                    }
                    break;
                
                //error occurred
                case 'error':
                    if(o.error && typeof(o.error) == 'function') {
                        o.error(msg.data.data, msg.data.url);
                    }
                    break;
                
                //completed a load (could be success or error)
                case 'complete':
                    if(o.complete && typeof(o.complete) == 'function') {
                        o.complete(msg.data.data, msg.data.url);
                    }
                    
                    delete this._loading[msg.data.url];
                    break;
                    
                //progress of a load
                case 'progress':
                    if(o.progress && typeof(o.progress) == 'function') {
                        o.progress(msg.data.data, msg.data.url);
                    }
                    break;
                    
                //log message
                case 'log':
                    console.log(msg.data);
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