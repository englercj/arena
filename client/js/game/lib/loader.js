define([
    'jquery',
    'game/lib/util',
    'game/resources'
], function($, util, resources) {
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
        loadArraySeries: function(files, opts) {
            var loader = this;
            
            (function loadLoop(i) {
                if(i == files.length) {
                    if(opts.complete && typeof(opts.complete) == 'function')
                        opts.complete(files.length);
                    
                    return;
                }
            
                if(opts.start && typeof(opts.start) == 'function')
                    opts.start(files[i], i);
                
                loader.load(files[i].file, {
                    success: function(data, url) {
                        files[i].data = data;
                        
                        if(opts.success && typeof(opts.success) == 'function')
                            opts.success(files[i], i, url);
                        
                        loadLoop(++i);
                    },
                    error: function(data, url) {
                        if(opts.error && typeof(opts.error) == 'function')
                            opts.error(files[i], i, url);
                        
                        loadLoop(++i);
                    },
                    progress: function(data, url) {
                        if(opts.progress && typeof(opts.progress) == 'function')
                            opts.progress(data, i, url);
                    }
                });
            })(0);
        },
        loadResources: function(cb) {
            var $progTotal = $('#progTotal'),
            $progPart = $('#progPart'),
            self = this,
            loaded = 0,
            total = resources.maps.length + resources.models.length,
            callbacks = {
                start: function(file, i) {
                    $progPart.progressbar('option', 'value', 0).children('.ui-progressbar-text').text(file.name);
                },
                success: function(file, i, url) {
                    ++loaded;
                    $progTotal.progressbar('option', 'value', ((i + 1 + loaded) / total) * 100);
                    $progPart.children('.ui-progressbar-text').text('');
                },
                error: function(file, i, url) {
                    ++loaded;
                    $progTotal.progressbar('option', 'value', ((i + 1 + loaded) / total) * 100);
                    $progPart.children('.ui-progressbar-text').text('');
                },
                progress: function(data, i, url) {
                    $progPart.progressbar('option', 'value', (data.loaded / data.total) * 100);
                }
            };
            
            $progTotal.children('.ui-progressbar-text').text('Loading Maps...');
            self.loadMaps(function() {
                $progTotal.children('.ui-progressbar-text').text('Loading Models...');
                self.loadModels(function() {
                    $progTotal.children('.ui-progressbar-text').text('Ready.');
                    if(cb) cb(resources);
                }, callbacks);
            }, callbacks);
        },
        loadMaps: function(cb, callbacks) {
            callbacks.complete = cb;
            
            //load Maps
            this.loadArraySeries(resources.maps, callbacks);
        },
        loadModels: function(cb, callbacks) {
            callbacks.complete = cb;
            
            //load Models
            this.loadArraySeries(resources.models, callbacks);
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