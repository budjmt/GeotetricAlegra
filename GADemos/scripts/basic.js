"use strict";

if ( !Detector.webgl ) Detector.addGetWebGLMessage();

var canvas;
var camera, scene, renderer;
var uniforms, clock;
var ui;

function width()  { return window.innerWidth  * 0.8; }
function height() { return window.innerHeight * 0.8; }

function render() {
    requestAnimationFrame(render);
    
    var dt = clock.getDelta();
    
    uniforms.time.value += dt;
    
    renderer.render(scene, camera);
    ui.render();
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width(), height(), false);
    renderer.setViewPort(0, 0, window.innerWidth, window.innerHeight);
}

window.addEventListener('load', function() {
   if(!Detector.webgl) return;
   try {
       var initWidth  = window.innerWidth;
       var initHeight = window.innerHeight;
       
       scene  = new THREE.Scene();
       //defines fall-off fog; exponential and off-white, from 0.5 to 10
       scene.fog = new THREE.FogExp2(0xeeeeee, 3, 10);
       
       //fov, aspect, near, far
       camera = new THREE.PerspectiveCamera(75, initWidth / initHeight, 0.1, 1000);
       camera.z = 5;
       
       canvas = document.querySelector('canvas');
       renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
       renderer.setPixelRatio(1);
       renderer.setSize(width(), height(), false);
       renderer.setViewport(0, 0, initWidth, initHeight);
       renderer.setClearColor(0xFFFFFF, 1);
       render.shadowMapEnabled = true;
       
       clock = new THREE.Clock(true);
       requestAnimationFrame(render);
   }
   catch(e) { }
});