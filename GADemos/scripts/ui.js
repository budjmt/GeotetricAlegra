"use strict";

ui = function() {
    this.camera = {};
    this.scene = {};
    this.render = renderUI;
    this.setup = setupUI; 
};
Object.seal(ui);

function renderUI() {
    renderer.render(ui.scene, ui.camera);
}

function setupUI() {
    //left, right, top, bottom, near, far
    ui.camera = new THREE.OrthographicCamera(0, window.innerWidth
                                        , 0, window.innerHeight, 0.1, 1000);
                                        
    ui.scene = new THREE.Scene();
}