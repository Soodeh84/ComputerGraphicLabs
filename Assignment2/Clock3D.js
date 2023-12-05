// "use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// Initialize WebGL renderer
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setClearColor('black');  // background color


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
light.intensity = 700;
scene.add(light);

const light2 = new THREE.PointLight();
light2.position.set(-10,-10,-10);
light2.intensity = 700;
scene.add(light2);



/*******************************cylindrical outer ring from ch5/ex2****************************************************/
// Materials
const mat = new THREE.MeshStandardMaterial({color:'#afeeee',
                                            metalness:0.1,
                                            roughness:0.1,
                                            flatShading:true,   
                                            side: THREE.DoubleSide});
const bodyRadius = 2.98; //clock body radius
const outerRadius = 3.3;  // inner radius of the ring
const height = 0.90;
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

//clock ticks-----------------------------------------------------------------------------------
const tickWidth = 0.08; //parallel to x-axis
const tickHeight = 0.03; //parallel to y-axis
const tickDepth = 0.01; //parallel to z-axis

const bigTickGeo = new THREE.BoxGeometry(tickWidth * 6, tickHeight * 3,tickDepth * 2 );
const smallTickGeo = new THREE.BoxGeometry(tickWidth * 3, tickHeight * 2,tickDepth * 2 );

//const bigTickMat = new THREE.MeshStandardMaterial({color: 'black'});
//const smallTickMat = new THREE.MeshStandardMaterial({color: 'gray'});

const allTicks = new THREE.Group();
scene.add(allTicks);
//tick intervals
const oneMinuteInterval = 2 * Math.PI / 60; // 60 minutes
//const fiveMinutesInterval = 2 * Math.PI / 12; // 12 five-minute intervals

//radius for big and small ticks
const bigTickRad = bodyRadius - 0.29;
const smallTickRad = bodyRadius - 0.19;

// Material for regular ticks
const regularTickMat = new THREE.MeshStandardMaterial({ color: 'black' });
// Material for the highlighted tick
const highlightedTickMat = new THREE.MeshStandardMaterial({ color: 'yellow' });

const initialRotation = Math.PI / 2;

for (let i = 0; i < 60; i++) {
  const tickGeo = i % 5 === 0 ? bigTickGeo : smallTickGeo;
  const tickMat = i === 0 ? highlightedTickMat : regularTickMat;
  const tickMesh = new THREE.Mesh(tickGeo, tickMat);

  const angle = i * oneMinuteInterval + initialRotation;
  
  // Set the position of the ticks based on their radius
  const tickRadius = i % 5 === 0 ? bigTickRad : smallTickRad;
  tickMesh.position.set(tickRadius * Math.cos(angle), tickRadius * Math.sin(angle), 1);

  // Rotate the tick to align with the clock
  tickMesh.rotation.set(0, 0,angle);

  allTicks.add(tickMesh);

  //add the ticks on the otherside
  const secondSideMesh = tickMesh.clone();
  secondSideMesh.position.set(tickRadius * Math.cos(- angle + Math.PI), tickRadius * Math.sin(- angle + Math.PI), 0);
  secondSideMesh.rotation.set(0, 0, - angle);

  allTicks.add(secondSideMesh);

}


//clock hands----------------------------------------------------------------------------------------
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
