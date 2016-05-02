function lerp(a,b,t) { return a * (1 - t) + b * t; }

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
	
	var magenta = new THREE.Color(0xff0066);
	var cyan = new THREE.Color(0x00ffee);
	var green = new THREE.Color(0x00ffaa);
	
	//var boundingBox = new THREE.Box3();
    var s = new Scene();
    s.scene = cubeS;
    s.update = function(dt) {
        cube.rotation.y -= 0.5 * dt;
		var mousePoint = mouseWorldCoords(cube.position.z);
		//boundingBox.setFromObject(cube);
		//if(boundingBox.containsPoint(mousePoint)) {
		if(mouseCast(cube).length) {
			cube.material.color = magenta;
		}
		else cube.material.color = cyan;
		if(uniforms.mouseDown > 0) {
			cube.material.color = green;
			cube.position.lerp(mousePoint,2*dt);
		}
    };
    return s;
}

var cubeScene = cubeSetup();
function basicCube() { scene = cubeScene; }

function codySetup() {
	var codyS = new THREE.Scene();
	var codyText;
	
	var optimer;
	new THREE.FontLoader().load('scripts/optimer_regular.typeface.js',
	function(response) { optimer = response; finishScene(); });
	
	function finishScene() {
		codyText = new THREE.Mesh(
			new THREE.TextGeometry('It cody!!!1!', {
				font: optimer,
				size: 0.5,
				height: 0.05
			}),
			new THREE.MeshBasicMaterial()
		);
		var green = new THREE.Color(0x00ff44);
		codyText.material.color = green;
		codyS.add(codyText);
	}
	
    var s = new Scene();
    s.scene = codyS;
    s.update = function(dt) {
        codyText.rotation.z -= 0.5 * dt;
    };
    return s;
}

var codyScene = codySetup();
function cody() { scene = codyScene; }

var arrows;
var spinArrows;
function e1Setup() {
	var e1S = new THREE.Scene();
	var l = 0.2;
	arrows = new THREE.Object3D();
	arrows.add(new THREE.ArrowHelper(
		new THREE.Vector3(1,0,0).normalize(),
		new THREE.Vector3(0,0,0),
		l, 0x222222,
		0.2, 0.15
	));
	e1S.add(arrows);
	
	spinArrows = function(dt) {
		arrows.rotation.x += 0.1 * dt;
		arrows.rotation.y += 0.5 * dt;
	};
	
	var s = new Scene();
	s.scene = e1S;
	s.update = function(dt) {
		if(l < 1) {
			l = lerp(l, 1.1, 0.1);
			arrows.children[0].setLength(l,0.2,0.15);
		}
		else s.update = spinArrows;
	}
	return s;
}

var e1Scene = e1Setup();
function e1() { scene = e1Scene; }

function e2() {
	var l = 0.2;
	arrows.add(new THREE.ArrowHelper(
		new THREE.Vector3(0,1,0).normalize(),
		new THREE.Vector3(0,0,0),
		l, 0x0000aa,
		0.2, 0.15
	));
	arrows.children[0].setColor(0xaa0000);

	scene.update = function(dt) {
		if(l < 1) {
			l = lerp(l, 1.1, 0.1);
			arrows.children[1].setLength(l,0.2,0.15);
		}
		else scene.update = spinArrows;
	}
}

function e3() {
	var l = 0.2;
	arrows.add(new THREE.ArrowHelper(
		new THREE.Vector3(0,0,1).normalize(),
		new THREE.Vector3(0,0,0),
		l, 0x00aa00,
		0.2, 0.15
	));

	scene.update = function(dt) {
		if(l < 1) {
			l = lerp(l, 1.1, 0.1);
			arrows.children[2].setLength(l,0.2,0.15);
		}
		else scene.update = spinArrows;
	}
}