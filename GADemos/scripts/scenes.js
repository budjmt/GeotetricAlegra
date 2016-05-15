function lerp(a,b,t) { return a * (1 - t) + b * t; }
function clamp(val,min,max) { (val > max && (val = max)) || (val < min && (val = min)); return val; }

function clear() {
    scene.reset && scene.reset();
    camera.position.set(0,0,5);
    camera.rotation.set(0,0,0);
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
    s.reset = function() { cube.position.set(0,0,0); cube.rotation.set(10,45,0); };
    s.reset();
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
    var startLen = 0.2;
	var l = startLen;
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
	
    var updateFunc = function(dt) {
		if(l < 1) {
			l = lerp(l, 1.1, 0.1);
			arrows.children[0].setLength(l,0.2,0.15);
		}
		else s.update = spinArrows;
	};
    
	var s = new Scene();
	s.scene = e1S;
    s.reset = function() { 
        for(var i = arrows.children.length - 1; i > 0; i--)
            arrows.remove(arrows.children[i]);
        arrows.rotation.set(0,0,0); 
        l = startLen;
        arrows.children[0].setLength(l);
        arrows.children[0].setColor(0x222222); 
        s.update = updateFunc; 
    };
	s.update = updateFunc; 
	return s;
}

var e1Scene = e1Setup();
function e1() { scene = e1Scene; }

//intended to follow e1
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

//intended to follow e2
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

var opPlane;
function outerProductSetup() {
    var outerS = new THREE.Scene();
    var startScale = 0.1;
	var scale = startScale;
	var axes = new THREE.Object3D();
	axes.add( new THREE.ArrowHelper( new THREE.Vector3(1,0,0).normalize(), new THREE.Vector3(0,0,0), 1, 0xaa0000, 0.2, 0.15 ) );
    axes.add( new THREE.ArrowHelper( new THREE.Vector3(0,1,0).normalize(), new THREE.Vector3(0,0,0), 1, 0x0000aa, 0.2, 0.15 ) );
    
    var opPlane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 1, 1, 5 ), new THREE.MeshBasicMaterial( { color: 0xffeeee, opacity: 0.5, transparent: true } ) );
    opPlane.position.x = 0.5;
    opPlane.scale.y = 0.001;
    axes.add(opPlane);
	outerS.add(axes);
    
    var mouseSlide = function(dt) {
        var y = axes.children[0].position.y;
            var mousePoint = mouseWorldCoords(axes.children[0].position.z);
            var segment = new THREE.Vector3(0,axes.children[0].scale.y,0);
            var len = segment.y; 
            segment.applyEuler(axes.children[0].rotation);
            var start   = new THREE.Vector3().copy(axes.children[0].position);
            var toMouse = new THREE.Vector3().copy(mousePoint).sub(start);
            var t = clamp(toMouse.dot(segment), 0, 1) / (len * len);
            segment.multiplyScalar(t).add(start);
            var distSq = segment.distanceToSquared(mousePoint);
            if(distSq < 0.85) {
                if(uniforms.mouseDown) {
                    axes.children[0].position.y = clamp(lerp(y, mousePoint.y, Math.min(2 * dt, 1)), 0, 1);
                    document.body.style.cursor = "grabbing";
                    document.body.style.cursor = "-webkit-grabbing";
                }
                else {
                    axes.children[0].position.y = Math.max(lerp(y, y - 0.2, Math.min(2 * dt, 1)), 0);
                    document.body.style.cursor = "grab";
                    document.body.style.cursor = "-webkit-grab";
                }
            }
        else {
            axes.children[0].position.y = Math.max(lerp(y, y - 0.2, Math.min(2 * dt, 1)), 0);
            document.body.style.cursor = "default";
        }
        //scale and position the plane so that it fits properly
        opPlane.scale.y = axes.children[0].position.y || 0.001;
        opPlane.position.y = axes.children[0].position.y * 0.5;
    };
    
	scene.update = function(dt) {
        camera.position.x = 0.35;
        camera.position.z = 2;
		if(scale < 1) {
			scale = lerp(scale, 1.1, 0.1);
			axes.scale.set(scale,scale,scale);
		}
		else s.update = mouseSlide;
	};
}

var outerProductScene = outerProductSetup();
function outerProduct() { scene = outerProductScene; }

//intended to follow outerProduct
function outerProduct3D() {
     var outerS = new THREE.Scene();
    var startScale = 0.1;
	var scale = startScale;
	var axes = new THREE.Object3D();
    axes.add( new THREE.ArrowHelper( new THREE.Vector3(0,0,1).normalize(), new THREE.Vector3(0,0,0), 1, 0x00aa55, 0.2, 0.15 ) );
    
    var box = new THREE.Mesh( new THREE.BoxBufferGeometry( 1, 1, 1, 5 ), new THREE.MeshBasicMaterial( { color: 0xffeeee, opacity: 0.5, transparent: true } ) );
    box.position.x = 0.5;
    box.position.z = 0.5;
    box.scale.z = 0.001;
    axes.add(box);
    
    var mouseSlide = function(dt) {
        var y = axes.children[0].position.z;
            var mouseCast = mouseCast(opPlane);
            if(mouseCast.length) {
                var mousePoint = mouseCast[0].point;
                if(uniforms.mouseDown) {
                    axes.children[0].position.y = clamp(lerp(y, mousePoint.y, Math.min(2 * dt, 1)), 0, 1);
                    document.body.style.cursor = "grabbing";
                    document.body.style.cursor = "-webkit-grabbing";
                }
                else {
                    axes.children[0].position.y = Math.max(lerp(y, y - 0.2, Math.min(2 * dt, 1)), 0);
                    document.body.style.cursor = "grab";
                    document.body.style.cursor = "-webkit-grab";
                }
            }
        else {
            axes.children[0].position.y = Math.max(lerp(y, y - 0.2, Math.min(2 * dt, 1)), 0);
            document.body.style.cursor = "default";
        }
        //scale and position the plane so that it fits properly
        plane.scale.y = axes.children[0].position.y || 0.001;
        plane.position.y = axes.children[0].position.y * 0.5;
    };
    
    var updateFunc = function(dt) {
        camera.position.x = 0.35;
        camera.position.z = 2;
		if(scale < 1) {
			scale = lerp(scale, 1.1, 0.1);
			axes.scale.set(scale,scale,scale);
		}
		else s.update = mouseSlide;
	};
    
	var s = new Scene();
	s.scene = outerS;
    s.reset = function() { 
        scale = startScale;
        axes.scale.set(scale,scale,scale);
        axes.children[0].position.y = 0;
        plane.position.y = 0;
        plane.scale.y = 0.001; 
        s.update = updateFunc; 
    };
	s.update = updateFunc;
}