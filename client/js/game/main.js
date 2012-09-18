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
    'game/lib/engine',
    //Scripts that modify global:
    'game/vendor/three/Detector'
], function($, util, Engine) {
    $(function() {
        if (!Detector.webgl) {
            $('#game').append(Detector.getWebGLErrorMessage());
            return;
        }

        var engine = new Engine('#game');
        engine.start();
    });
});
