define([
    //Modules
    'jquery',
    'game/lib/viewport',
    'game/lib/controls',
    'game/lib/world',
    'game/lib/hud',
    'game/lib/constants'
], function($, Viewport, Controls, World, HUD, CONST) {
    var Engine = Class.extend({
        init: function(container, resources) {
            //setup game
            var scene = this.scene = new THREE.Scene(),
                clock = this.clock = new THREE.Clock(),
                renderer = this.renderer = new THREE.WebGLRenderer(),
                view = this.viewport = new Viewport(container, renderer),
                camera = this.camera = new THREE.PerspectiveCamera(60, view.aspect(), 1, 10000),
                controls = this.controls = new Controls(view, camera),//new THREE.FirstPersonControls(camera);
                world = this.world = new World(scene, resources.maps[0]),
                hud = this.hud = new HUD();
            
            //setup camera
            camera.position.z = 300;
            camera.position.y = CONST.UNIT_SIZE; //raise camera off the ground
            scene.add(camera);
            
            //create point light
            /*var pLight = new THREE.PointLight(0xFFFFFF);

            //set position
            pLight.position.x = 10;
            pLight.position.y = 50;
            pLight.position.z = 130;

            scene.add(pLight);*/

            var stats = this.stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            
            view.append(stats.domElement);
        },
        start: function() {
            this._paint();
        },
        _paint: function() {
            //proxy the call so we retain the context
            requestAnimationFrame($.proxy(this._paint, this));
            
            var delta = this.clock.getDelta();
            
            //update stats box
            this.stats.update();
            
            //update controls
            this.controls.update(delta);
            
            //do trace/collision checks
            
            //render scene
            this.renderer.render(this.scene, this.camera);
        }
    });
    
    return Engine;
});