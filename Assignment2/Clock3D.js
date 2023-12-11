// "use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

// Initialize WebGL renderer
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setClearColor('black');  // background color

// Create a new Three.js scene
const scene = new THREE.Scene();

// Add a camera
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 500 );
camera.position.set(0,0,7);

// Add light sources
scene.add(new THREE.AmbientLight('#909090'));
const light = new THREE.PointLight();
light.position.set(10,10,10);
light.intensity = 50;
scene.add(light);
/*************************************************ClockBody************************* */
const bodyRadius = 3; //clock body radius
const bodyGeo = new THREE.CylinderGeometry( bodyRadius, bodyRadius, 0.85, 62 ); 
const bodyMat = new THREE.MeshStandardMaterial({ color: '#cccccc',
                                                 metalness: 0.5,
                                                 roughness: 0.5}); 
const clockBody = new THREE.Mesh( bodyGeo, bodyMat ); 
clockBody.rotation.x = 1.56;
clockBody.position.set(0, 0, 0.5);
scene.add( clockBody );
/*******************************************clock ticks******************************/
const tickWidth = 0.08; //parallel to x-axis
const tickHeight = 0.03; //parallel to y-axis
const tickDepth = 0.01; //parallel to z-axis

const oneMinuteInterval = 2 * Math.PI / 60; //tick intervals: 6°
const bigTickRad = 2.73; //radius for big ticks
const smallTickRad = 2.83; //radius for small ticks
const initialRotation = Math.PI / 2; //90°

const bigTickGeo = new THREE.BoxGeometry(tickWidth * 6, tickHeight * 3,tickDepth * 2 );
const smallTickGeo = new THREE.BoxGeometry(tickWidth * 3, tickHeight * 2,tickDepth * 2 );

const regularTickMat = new THREE.MeshStandardMaterial({ color: '#000033' }); //Material for all ticks except the 12 O'clock
const highlightedTickMat = new THREE.MeshStandardMaterial({ color: '#ffff99' }); //Material for the 12 O'clock tick

const allTicks = new THREE.Group();
for (let i = 0; i < 60; i++) {
  const tickMesh = new THREE.Mesh(i % 5 === 0 ? bigTickGeo: smallTickGeo, 
                                  i === 0 ? highlightedTickMat: regularTickMat);
  const angle = i * oneMinuteInterval + initialRotation;

  const tickRadius = i % 5 === 0 ? bigTickRad : smallTickRad; // Set the position of the ticks based on their radius
  tickMesh.position.set(tickRadius * Math.cos(angle), tickRadius * Math.sin(angle), 1);
  tickMesh.rotation.set(0, 0,angle); // Rotate the ticks to align with the clock
  allTicks.add(tickMesh);
  //add the ticks on the otherside
  const secondSideMesh = tickMesh.clone();
  secondSideMesh.position.set(tickRadius * Math.cos(-angle + Math.PI), tickRadius * Math.sin(-angle + Math.PI), 0);
  secondSideMesh.rotation.set(0, 0, -angle);

  allTicks.add(secondSideMesh);
}
scene.add(allTicks);
/*********************************************clockHands****************************** */
//......seconds hand......
//front
const secondHandMesh = new THREE.Mesh( new THREE.BoxGeometry(2.5, 0.05, 0.05), new THREE.MeshBasicMaterial({color: 'purple'})); 
//back
const secondHandBMesh = new THREE.Mesh( new THREE.BoxGeometry(2.5, 0.05, 0.05), new THREE.MeshBasicMaterial({color: '#003300'})); 
//.....minutes hands.....
//Front
const minuteHandMesh = new THREE.Mesh(  new THREE.SphereGeometry(2.2), 
                                    new THREE.MeshStandardMaterial({ color: '#808080'}));
//Back
const minuteHandBackMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2), new THREE.MeshStandardMaterial({ color: '#cc6666'}));
//....Hours hand.....
//Front
const hourHandMesh = new THREE.Mesh(new THREE.SphereGeometry(3.1), new THREE.MeshStandardMaterial({ color: 'black'}));
//back
const hourHandBackMesh = new THREE.Mesh(new THREE.SphereGeometry(3.1), new THREE.MeshStandardMaterial({ color: '#330033'}));

const clockHands = new THREE.Object3D();
clockHands.add(minuteHandMesh);//child[0]
clockHands.add(minuteHandBackMesh);//child[1]
clockHands.add(hourHandMesh);//child[2]
clockHands.add(hourHandBackMesh);//child[3]
clockHands.add(secondHandMesh);//child[4]
clockHands.add(secondHandBMesh);//child[5]
scene.add(clockHands);

const minuteHand = clockHands.children[0]; minuteHand.scale.set(0.65, 0.04, 0.05);
const minuteHandBack = clockHands.children[1]; minuteHandBack.scale.set(0.65, 0.04, 0.05); 
const hourHand = clockHands.children[2]; hourHand.scale.set(0.3, 0.035, 0.03);
const hourHandBack = clockHands.children[3]; hourHandBack.scale.set(0.3, 0.035, 0.03);
const secondHand = clockHands.children[4]; 
const secondHandB = clockHands.children[5]; 
/**************************************************ClockBlob************************************ */
//front
const blobGeo = new THREE.SphereGeometry( 0.35, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); //create hemisphere
const blobMat = new THREE.MeshStandardMaterial( { color: 'purple',
                                                  transparent: true,
                                                  opacity: 1,
                                                  metalness: 0.5,
                                                  roughness: 0.5} ); 
const clockBlob= new THREE.Mesh( blobGeo, blobMat); 
clockBlob.position.set(0,0,0.85);
clockBlob.rotation.x = 1.5;
scene.add( clockBlob);
//back
const blobGeoB = new THREE.SphereGeometry( 0.35, 32, 32, 0, 2*Math.PI, 0, Math.PI/2); 
const blobMatB = new THREE.MeshStandardMaterial( { color: 'green',
                                                  transparent: true,
                                                  opacity: 1,
                                                  metalness: 0.5,
                                                  roughness: 0.5} ); 
const clockBlobB = new THREE.Mesh( blobGeoB, blobMatB); 
clockBlobB.position.set(0,0,0.15);
clockBlobB.rotation.x = -1.5;
scene.add( clockBlobB);
/*******************************cylindrical outer ring from ch5/ex2****************************************************/
const mat = new THREE.MeshStandardMaterial({color:'#6accbc',
                                            metalness:0.2,
                                            roughness:0.2,
                                            flatShading:true,   
                                            side: THREE.DoubleSide});

const outerRadius = 3.4;  // inner radius of the ring
const height = 0.90;

// a ring with ExtrudeGeometry
const outerCircle = new THREE.Shape();
outerCircle.moveTo(outerRadius, 0);
const innerCircle = new THREE.Shape();   // serves as hole in outerCircle
innerCircle.moveTo(bodyRadius, 0);
const N =100;
const deltaPhi = 2*Math.PI / N;
for(let k=1; k<=N; ++k) {
  outerCircle.lineTo(outerRadius*Math.cos(k*deltaPhi),
                     outerRadius*Math.sin(k*deltaPhi));
  innerCircle.lineTo(bodyRadius*Math.cos(k*deltaPhi),
                     bodyRadius*Math.sin(k*deltaPhi));
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

  //--------------for Hamburg Time!---------------
  let date = new Date();
  const rad = 1.2;

  let seconds = date.getSeconds();
  let minutes = date.getMinutes();
  let hours   = date.getHours();
  //update Hamburg seconds
  const secondRotation = (Math.PI/30) * -seconds;
  secondHand.rotation.z = initialRotation + secondRotation;
  secondHand.position.set(rad*Math.cos(initialRotation + secondRotation),rad*Math.sin(initialRotation + secondRotation), 1.05);
  //update Hamburg minutes
  const minuteRotation = (Math.PI/30) * -minutes;
  minuteHand.rotation.z = initialRotation + minuteRotation;
  minuteHand.position.set(rad * Math.cos(initialRotation + minuteRotation), 
                          rad * Math.sin(initialRotation + minuteRotation), 
                          0.95);
  //update Hamburg hour
  const hourRotation = (Math.PI/6) * -(hours % 12 + minutes/60);
  hourHand.rotation.z = initialRotation + hourRotation;
  hourHand.position.set(rad*Math.cos(initialRotation + hourRotation),
                        rad*Math.sin(initialRotation + hourRotation),
                        0.9);
  //-------------------------Texas Time!---------------------------
  //Central Time with time offset: UTC/GMT-06:00
  const timezoneOffsets = -6;
  let utc = date.getTime()+(date.getTimezoneOffset() * 60000); //current utc + (offset(min) and convert to millisec by *60000
  let TexasDate = new Date(utc + (3600000 * timezoneOffsets));

  let secondsT = TexasDate.getSeconds();
  let minutesT = TexasDate.getMinutes();
  let hoursT   = TexasDate.getHours();
  //update Texas seconds
  const secondRotationB = (Math.PI/30) * secondsT;
  secondHandB.rotation.z = initialRotation + secondRotationB;
  secondHandB.position.set(rad*Math.cos(initialRotation + secondRotationB),rad*Math.sin(initialRotation + secondRotationB), -0.05);
  //update Texas minutes
  const minuteRotationT = (Math.PI/30) * minutesT;
  minuteHandBack.rotation.z = initialRotation + minuteRotationT;
  minuteHandBack.position.set(rad * Math.cos(initialRotation + minuteRotationT), 
                          rad * Math.sin(initialRotation + minuteRotationT), 
                          0.04);
  //update Texas hour
  const hourRotationT = (Math.PI/6) * (hoursT % 12 + minutesT/60);
  hourHandBack.rotation.z = initialRotation + hourRotationT;
  hourHandBack.position.set(rad*Math.cos(initialRotation + hourRotationT),
                        rad*Math.sin(initialRotation + hourRotationT),
                        0.05);

  controls.update();
  renderer.render(scene, camera);
}
render();