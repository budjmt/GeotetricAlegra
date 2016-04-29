function clear() {
    scene = baseScene;
}

function cubeSetup() {
    var cubeS = new THREE.Scene();
    var cube = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshPhongMaterial({ 
            color: 0x00ffee,
            emissive: 0x553333
        })
    );
    cube.rotation.set(10,45,0);
    
    var light = new THREE.DirectionalLight(0xffffff,1.0);
    light.position.set(1,2,3);
    light.rotation.set(-45,45,0);
    cubeS.add(cube);
    cubeS.add(light);
    var s = new Scene();
    s.scene = cubeS;
    s.update = function(dt) {
        cube.rotation.y -= 0.5 * dt;
    };
    return s;
}

var cubeScene = cubeSetup();
function basicCube() { scene = cubeScene; }