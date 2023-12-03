// "use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// Initialize WebGL renderer
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setClearColor('white');  // background color


// Create a new Three.js scene
const scene = new THREE.Scene();
// Just for debugging: delete for the final version!
const axesHelper = new THREE.AxesHelper();
scene.add( axesHelper );

// Add a camera
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 500 );
camera.position.set(1,2,5);

// Add the clock here:


const controls = new TrackballControls(camera, renderer.domElement);
// Render the scene
function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}
render();
