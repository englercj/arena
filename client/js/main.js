//configure require
require.config({
    waitSeconds: 2000
});

//wrapper to include globals
define(['global/class', 'global/game-shim', 'global/events'], function() {
    
    require(['game/main']);
    
    //TODO: Loading of big resources (maps/models) will HAVE to be done on a webworker
    //
    //console.log(EVENTS.on('resourceLoad', function(context, map, depMaps) {
    //    console.log(this.toString(), map);
    //}));
    
    //require(['game/maps/bird','game/maps/bird1','game/maps/bird2','game/maps/bird3','game/maps/bird4','game/maps/bird5']);
});