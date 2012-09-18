define([
    //Modules
    'jquery',
    'game/lib/viewport',
    //Scripts that modify global
    'game/vendor/three/three.min',
    'game/vendor/three/Stats' 
], function($, Viewport) {
    var Engine = Class.extend({
        init: function(container) {
            var view = this.viewport = new Viewport(container);

            //setup renderer camera and scene
            var renderer = this.renderer = new THREE.WebGLRenderer(),
                camera = this.camera = new THREE.PerspectiveCamera(45, view.aspect(), 0.1, 10000),
                scene = this.scene = new THREE.Scene();

            //add camera to scene
            scene.add(camera);
            camera.position.z = 300;

            renderer.setSize(view.width(), view.height());

            view.append(renderer.domElement);

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
            requestAnimFrame($.proxy(this._paint, this));
            
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
    });
    
    return Engine;
});



var engine = {
    init: function() {
        
    },
    animate: function() {
        requestAnimFrame(engine.animate);
        renderer.render(scene, camera);
    }
};