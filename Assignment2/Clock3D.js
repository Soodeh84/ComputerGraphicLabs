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
const axesHelper = new THREE.AxesHelper(2.5);
scene.add( axesHelper );

// Add a camera
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 500 );
camera.position.set(0,0,7);

// Add light sources
scene.add(new THREE.AmbientLight('#909090'));
const light = new THREE.PointLight();
light.position.set(10,10,10);
light.intensity = 50;
scene.add(light);
/*************************ClockBody************************* */
const bodyRadius = 3; //clock body radius
const bodyGeo = new THREE.CylinderGeometry( bodyRadius, bodyRadius, 0.85, 62 ); 
const bodyMat = new THREE.MeshStandardMaterial({ color: 'white',
                                                 metalness: 0.5,
                                                 roughness: 0.5}); 
const clockBody = new THREE.Mesh( bodyGeo, bodyMat ); 
clockBody.rotation.x = 1.55;
clockBody.position.set(0, 0, 0.5);
scene.add( clockBody );

//clock ticks-----------------------------------------------------------------------------------
const tickWidth = 0.08; //parallel to x-axis
const tickHeight = 0.03; //parallel to y-axis
const tickDepth = 0.01; //parallel to z-axis

const bigTickGeo = new THREE.BoxGeometry(tickWidth * 6, tickHeight * 3,tickDepth * 2 );
const smallTickGeo = new THREE.BoxGeometry(tickWidth * 3, tickHeight * 2,tickDepth * 2 );

const allTicks = new THREE.Group();
scene.add(allTicks);
//tick intervals
const oneMinuteInterval = 2 * Math.PI / 60; // 60 minutes

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

/***********clockHands****************************** */
//seconds hand
//front
const secondHandGeo = new THREE.BoxGeometry(2, 0.05, 0.05 ); 
const secondHandMat= new THREE.MeshBasicMaterial( {color: 'black'} ); 
const secondHand = new THREE.Mesh( secondHandGeo, secondHandMat ); 
//secondHand.position.set(0,0,0);
scene.add( secondHand);

//back
/* const secondHandGeoB = new THREE.BoxGeometry(2, 0.05, 0.05 ); 
const secondHandMatB= new THREE.MeshBasicMaterial( {color: 'black'} ); 
const secondHandB = new THREE.Mesh( secondHandGeoB, secondHandMatB ); 
secondHandB.position.set(0,0,0);
scene.add( secondHandB); */

//minute hands 
//Front
const minuteHand = new THREE.Mesh(new THREE.SphereGeometry(2.1), new THREE.MeshStandardMaterial({ color: 'orange' }));
minuteHand.scale.set(0.6, 0.05, 0.05); // Scaled sphere for the minute hand
//minuteHand.position.set(0,0,0);
scene.add(minuteHand);


//Back
/* const minuteHandBack = new THREE.Mesh(new THREE.SphereGeometry(3), new THREE.MeshStandardMaterial({ color: 'blue' }));

scene.add(minuteHandBack);
minuteHandBack.scale.set(0.3, 0.02, 0.03); // Scaled sphere for the minute hand
minuteHandBack.position.set(0,0,0); */

//hour hands
//front
const hourHand = new THREE.Mesh(new THREE.SphereGeometry(3.3), new THREE.MeshStandardMaterial({   color: 'blue',
                                                                                                transparent: true,
                                                                                                opacity: 0.8,
                                                                                                metalness:0.3,
                                                                                                roughness:0.5}));
scene.add(hourHand);
hourHand.scale.set(0.3, 0.02, 0.03);  // Scaled sphere for the hour hand
//hourHand.position.set(0,0,0);
//back
/* const hourHandBack = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshStandardMaterial({ color: 'green' }));

scene.add(hourHandBack);
hourHandBack.scale.set(0.6, 0.05, 0.05);  // Scaled sphere for the hour hand */

/**************ClockBlob************************************ */
//front
const blobGeo = new THREE.SphereGeometry( 0.53, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); //create hemisphere
const blobMat = new THREE.MeshStandardMaterial( { color: 'purple',
                                                  transparent: true,
                                                  opacity: 1,
                                                  metalness: 0.5,
                                                  roughness: 0.5} ); 
const clockBlob= new THREE.Mesh( blobGeo, blobMat); 
clockBlob.position.set(0,0,0.5);
clockBlob.rotation.x = 1.5;
scene.add( clockBlob);

//back
const blobGeoB = new THREE.SphereGeometry( 0.53, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); //create hemisphere
const blobMatB = new THREE.MeshStandardMaterial( { color: 'green',
                                                  transparent: true,
                                                  opacity: 1,
                                                  metalness: 0.5,
                                                  roughness: 0.5} ); 
const clockBlobB = new THREE.Mesh( blobGeoB, blobMatB); 
clockBlobB.position.set(0,0,0.5);
clockBlobB.rotation.x = -1.5;
scene.add( clockBlobB);

/*******************************cylindrical outer ring from ch5/ex2****************************************************/
const mat = new THREE.MeshStandardMaterial({color:'#afeeee',
                                            transparent: true,
                                            opacity: 0.5,
                                            metalness:0.2,
                                            roughness:0.2,
                                            flatShading:true,   
                                            side: THREE.DoubleSide});

const outerRadius = 3.4;  // inner radius of the ring
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

/************************************************************************************************* */
const controls = new TrackballControls(camera, renderer.domElement);
                       
// Render the scene
function render() {
  requestAnimationFrame(render);

  light.position.copy(camera.position.clone());

  //clockRotattion!
  let date = new Date();
  //console.log(date);
  const rad = 1.2;

  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hours   = date.getHours();
  //update seconds
  const secondRotation = (Math.PI/30) * -seconds;
  secondHand.rotation.z = initialRotation + secondRotation;
  secondHand.position.set(rad*Math.cos(initialRotation + secondRotation),rad*Math.sin(initialRotation + secondRotation), 1);

  //update minutes
  const minuteRotation = (Math.PI/30) * -minutes;
  minuteHand.rotation.z = initialRotation + minuteRotation;
  minuteHand.position.set(rad * Math.cos(initialRotation + minuteRotation), 
                          rad * Math.sin(initialRotation + minuteRotation), 
                          0.95);

  //update hour
  const hourRotation = (Math.PI/6) * -(hours % 12 + minutes/60);
  hourHand.rotation.z = initialRotation + hourRotation;
  hourHand.position.set(rad*Math.cos(initialRotation + hourRotation),
                        rad*Math.sin(initialRotation + hourRotation),
                        0.9);



  controls.update();
  renderer.render(scene, camera);
}
render();