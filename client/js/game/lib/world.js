define([
    //Modules
    'jquery',
    'game/lib/constants'
], function($, CONST) {
    var World = Class.extend({
        init: function(scene, map) {
            this.scene = scene;
            
            var jLoader = new THREE.JSONLoader();
            jLoader.createModel(map.data, function(geometry) {
                var material = new THREE.MeshFaceMaterial(),
                mesh = new THREE.Mesh(geometry, material);
                
                mesh.scale.set(50, 50, 50);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.dynamic = true;

                scene.add(mesh);
            }, map.texturePath);
            
            //add fog to scene
            scene.fog = new THREE.FogExp2(CONST.FOG_COLOR, CONST.FOG_DENSITY);
            
            //add flat floor
            /*scene.add(new THREE.Mesh(
                new THREE.CubeGeometry(10 * CONST.UNIT_SIZE, 10, 10 * CONST.UNIT_SIZE),
                new THREE.MeshLambertMaterial({color: 0xEDCBA0})
            ));*/
                
            //add sphere
            /*var sphere = new THREE.Mesh(
                new THREE.SphereGeometry(
                    CONST.UNIT_SIZE,
                    16,
                    16
                ),
                new THREE.MeshLambertMaterial({
                    color: 0xCC0000
                })
            );
            sphere.position.y = CONST.UNIT_SIZE;

            scene.add(sphere);*/
                
            //add lighting
            var directionalLight1 = new THREE.DirectionalLight(0xF7EFBE, 0.7);
            directionalLight1.position.set(0.5, 1, 0.5);
            scene.add(directionalLight1);
            
            var directionalLight2 = new THREE.DirectionalLight(0xF7EFBE, 0.5);
            directionalLight2.position.set(-0.5, -1, -0.5);
            scene.add(directionalLight2);
        }
    });
    
    return World;
});