/*
 * Compatible with:
 * Chrome 19+ (with about:flags, webGL enable)
 * Firefox 14+
 * Firefox for Android 15+
 * Safari 6+
 * Opera 12+
 * Opera Mobile 12+
 * Blackberry Browser 10+
 */

require([
    //Modules:
    'jquery',
    'game/lib/util',
    'game/lib/loader',
    'game/lib/engine',
    //Scripts that modify global:
    'game/vendor/three/three.min',
    'game/vendor/three/Stats',
    'game/vendor/three/Detector'
], function($, util, Loader, Engine) {
    $(function() {
        //Detect if webgl is supported, and if not exit
        if (!Detector.webgl) {
            $('#game').append(Detector.getWebGLErrorMessage());
            return;
        }
        
        //Initialize engine when startup button is clicked
        var engine;
        $('#btnStart').on('click', function(e) {
            e.preventDefault();
            
            if(!engine) {
                engine = new Engine('#game');
                engine.start();
                
                $('#btnStart').text('Show Game');
            } else {
                engine.viewport.requestFullScreen();
            }
        });
    });
});
