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
camera.position.set(0,0,7);

// Add light sources
scene.add(new THREE.AmbientLight('#909090'));
const light = new THREE.PointLight();
light.position.set(10,10,10);
light.intensity = 200;
scene.add(light);

/*******************************cylindrical outer ring from ch5/ex2****************************************************/
// Materials
const mat = new THREE.MeshStandardMaterial({color:'#afeeee',
                                            metalness:0.1,
                                            roughness:0.1,
                                            flatShading:true,   
                                            side: THREE.DoubleSide});
const bodyRadius = 3; //clock body radius
const outerRadius = 3.5;  // inner radius of the ring
const height = 0.5;
const innerRadius = 3;

// a ring with ExtrudeGeometry
const outerCircle = new THREE.Shape();
outerCircle.moveTo(outerRadius, 0);
const innerCircle = new THREE.Shape();   // serves as hole in outerCircle
innerCircle.moveTo(innerRadius, 0);
const N =100;
const deltaPhi = 2*Math.PI / N;
for(let k=1; k<=N; ++k) {
  outerCircle.lineTo(outerRadius*Math.cos(k*deltaPhi),
                     outerRadius*Math.sin(k*deltaPhi));
  innerCircle.lineTo(innerRadius*Math.cos(k*deltaPhi),
                     innerRadius*Math.sin(k*deltaPhi));
}
outerCircle.holes.push(innerCircle);

const extrudeSettings = {
  bevelEnabled: false,
  depth: height,
};
const extrudeGeo = new THREE.ExtrudeGeometry(outerCircle, extrudeSettings);
const extrudeRing = new THREE.Mesh(extrudeGeo, mat);
scene.add(extrudeRing);

/*******************************************Add the clock here:****************************************************** */
//clock main body
const mat1 = new THREE.MeshStandardMaterial({color:'white',
                                            metalness:0,
                                            roughness:1,
                                            flatShading:true,   
                                            side: THREE.DoubleSide});

// clock body with ExtrudeGeometry
const clockBody = new THREE.Shape();
clockBody.moveTo(bodyRadius, 0); 

for(let k=1; k<=N; ++k) {
  clockBody.lineTo(bodyRadius*Math.cos(k*deltaPhi),
                   bodyRadius*Math.sin(k*deltaPhi));
}

const extrudeSettings1 = {
  bevelEnabled: false,
  depth: height,
};
const extrudeGeo1 = new THREE.ExtrudeGeometry(clockBody, extrudeSettings1);
const extrudeRing1 = new THREE.Mesh(extrudeGeo1, mat1);
scene.add(extrudeRing1);

//clock ticks
//clock hands
//clock blob

/************************************************************************************************* */
const controls = new TrackballControls(camera, renderer.domElement);
// Render the scene
function render() {
  requestAnimationFrame(render);

  controls.update();
  renderer.render(scene, camera);
}
render();
