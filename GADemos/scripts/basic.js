"use strict";
if ( !Detector.webgl ) Detector.addGetWebGLMessage();

var Scene = function() {
    this.scene = undefined;
    this.update = undefined;
    this.reset = undefined;
};

var canvas;
var camera, baseScene, scene, renderer, raycaster;
var uniforms, clock, dt = 0;

function width()  { return window.innerWidth  * 0.65; }
function height() { return window.innerHeight * 0.65; }

function render() {
    requestAnimationFrame(render);
    
    dt = clock.getDelta();
    scene.update && scene.update(dt);
    
    uniforms.time.value += dt;
    renderer.render(scene.scene, camera);
}

window.addEventListener('mousemove', function(event) {
	uniforms.mouse.x = event.clientX;
	uniforms.mouse.y = event.clientY;
});
window.addEventListener('mousedown', function(event) {
	uniforms.mouseDown += dt;
});
window.addEventListener('mouseup', function(event) {
	uniforms.mouseDown = 0;
});
	
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width(), height(), false);
    //renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', resize);

window.addEventListener('load', function() {
	if(!Detector.webgl) return;
	try {
		var initWidth  = window.innerWidth;
		var initHeight = window.innerHeight;
       
		baseScene = new Scene();
		baseScene.scene = new THREE.Scene();
		//defines fall-off fog; exponential and off-white, from 0.5 to 10
		//baseScene.scene.fog = new THREE.FogExp2(0xEEEEEE, 3, 10);
       
		//fov, aspect, near, far
		camera = new THREE.PerspectiveCamera(75, initWidth / initHeight, 0.1, 1000);
		camera.position.z = 5;
       
		canvas = document.querySelector('canvas');
		//canvas.width  = initWidth;
		//canvas.height = initHeight;
		renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
		renderer.setPixelRatio(1);
		renderer.setSize(width(), height(), false);
		//renderer.setViewport(0, 0, initWidth, initHeight);
		renderer.setClearColor(0xFFFFFF, 1);
		//renderer.shadowMapEnabled = true;
		
		uniforms = {
				time : { type: "f", value: 0. },
				mouse: { type: "v2", value: new THREE.Vector2 },
				mouseDown: { type: "f", value: 0 },
				resolution: { type: "v2", value: new THREE.Vector2 }
			};
		
		raycaster = new THREE.Raycaster();
		clock = new THREE.Clock(true);
		scene = baseScene;
		requestAnimationFrame(render);
	}
	catch(e) { alert('WebGL failed'); }
});

function mouseWorldCoords(zDepth) {
	var mouseVec = new THREE.Vector3(
		 uniforms.mouse.x / window.innerWidth  * 2 - 1, 
		-uniforms.mouse.y / window.innerHeight * 2 + 1, 
		0.5
	);
	mouseVec.unproject(camera);
	
	var dir = mouseVec.sub(camera.position).normalize();
	var dist = (zDepth - camera.position.z) / dir.z;
	mouseVec = camera.position.clone().add(dir.multiplyScalar(dist));
	return mouseVec;
}

function mouseCast(object) {
	var mouseVec = new THREE.Vector2(
		 uniforms.mouse.x / window.innerWidth  * 2 - 1, 
		-uniforms.mouse.y / window.innerHeight * 2 + 1 
	);
	raycaster.setFromCamera(mouseVec, camera);
	return raycaster.intersectObject(object,true);
}