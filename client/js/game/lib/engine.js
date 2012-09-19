define([
    //Modules
    'jquery',
    'game/lib/viewport',
    'game/lib/controls',
    'game/lib/constants',
    //Scripts that modify global
    'game/vendor/three/three.min',
    'game/vendor/three/Stats' 
], function($, Viewport, Controls, CONST) {
    var Engine = Class.extend({
        init: function(container) {
            //setup game
            var scene = this.scene = new THREE.Scene(),
                clock = this.clock = new THREE.Clock(),
                renderer = this.renderer = new THREE.WebGLRenderer(),
                view = this.viewport = new Viewport(container, renderer),
                camera = this.camera = new THREE.PerspectiveCamera(60, view.aspect(), 1, 10000),
                controls = this.controls = new Controls(view, camera);//new THREE.FirstPersonControls(camera);//
            
            //add fog to scene
            scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0005);
            
            //setup camera
            camera.position.z = 300;
            camera.position.y = CONST.UNIT_SIZE * 0.2; //raise camera off the ground
            scene.add(camera);
            
            //setup camera controls
            /*controls.movementSpeed = CONST.MOVE_SPEED;
            controls.lookSpeed = CONST.LOOK_SPEED;
            controls.lookVertical = false;
            controls.noFly = true;*/

            //add a mesh
            var radius = 50,
                segments = 16,
                rings = 16;

            var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(
                    radius,
                    segments,
                    rings
                ),
                new THREE.MeshLambertMaterial({
                    color: 0xCC0000
                })
            );

            scene.add(sphere);

            //create point light
            var pLight = new THREE.PointLight(0xFFFFFF);

            //set position
            pLight.position.x = 10;
            pLight.position.y = 50;
            pLight.position.z = 130;

            scene.add(pLight);

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
            
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
            this.controls.update(this.clock.getDelta());
        }
    });
    
    return Engine;
});