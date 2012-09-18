$(function() {
    //setup vars
    var $game = $('#game'),
        W = $game.width(),
        H = $game.height(),
        VIEW_ANGLE = 45,
        ASPECT = W / H,
        NEAR = 0.1,
        FAR = 10000;

    //setup renderer camera and scene
    var renderer = new THREE.WebGLRenderer(),
        camera = new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        ),
        scene = new THREE.Scene();

    //add camera to scene
    scene.add(camera);

    camera.position.z = 300;

    renderer.setSize(W, H);

    $game.append(renderer.domElement);

    //add a mesh
    var radius = 50,
        segments = 16,
        rings = 16;

    sphere = new THREE.Mesh(
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

    renderer.render(scene, camera);
});
