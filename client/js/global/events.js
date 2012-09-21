(function(window) {
    var cbs = {
        resourceLoad: {}
    };

    //Events object
    window.EVENTS = {
        on: function(event, cb) {
            if(!cbs[event]) return false;

            var guid;
            do { guid = generateGuid(); } while(cbs[event][guid]);

            cbs[event][guid] = cb;

            return guid;
        },
        off: function(event, guid) {
            //remove guid
            if(typeof(guid) == 'string' && cbs[event][guid]) {
                delete cbs[event][guid];
                return true;
            }
            //can pass the function to remove instead
            else if(typeof(guid) == 'function') {
                for(var id in cbs.resourceLoad) {
                    if(cbs[event].hasOwnProperty(id) && cbs[event][id] == guid) {
                        delete cbs[event][id];
                        return true;
                    }
                }
            }
            
            return false;
        },
        once: function(event, cb) {
            var guid = EVENTS.on(event, function() {
                EVENTS.off(event, guid); //'this' is the guid on callback
                
                cb.apply(guid, arguments);
            });
            
            return guid;
        },
        _doCallback: function(event, args) {
            for(var guid in cbs.resourceLoad) {
                if(cbs[event].hasOwnProperty(guid) && typeof(cbs[event][guid]) == 'function') {
                    cbs[event][guid].apply(guid, args);
                }
            }
        }
    };

    //actual events that happen, and we call the callbacks registered
    require.onResourceLoad = function(/*context, map, depMaps*/) {
        EVENTS._doCallback('resourceLoad', arguments);
    };

    //utility functions
    function generateGuid() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
})(window);