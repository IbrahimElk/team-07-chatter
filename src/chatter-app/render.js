/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// TODO: omzetten naar typescript

import * as THREE from 'three';
const scene = new THREE.Scene();
// The first attribute is the field of view. FOV is the extent of the scene that is seen on the display at any given moment. The value is in degrees
// the window is the application window (bv. lengte en breedte van google chrome tab)
// The next two attributes are the near and far clipping plane. What that means, is that objects further away from the camera than the value of far or closer than near won't be rendered.
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true, 
});

//for shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// the cube itself
const geometry = new THREE.BoxGeometry(1.999, 1.999, 1.999);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// By default, when we call scene.add(), the thing we add will be added to the coordinates (0,0,0).
scene.add(cube);

cube.castShadow = true;
cube.rotation.x = THREE.MathUtils.degToRad(45);
cube.rotation.y = THREE.MathUtils.degToRad(22.5);

const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x17202a }));
cube.add(line);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.castShadow = true;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
camera.position.z = 5;

scene.background = new THREE.Color(0xffffff);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

document.addEventListener('keydown', function (event) {
  cummalitiveTime = 0;
  if (event.code == 37) {
    cube.rotation.y -= 0.1;
  } else if (event.keyCode == 38) {
    cube.rotation.x += 0.1;
  } else if (event.keyCode == 39) {
    cube.rotation.y += 0.1;
  } else if (event.keyCode == 40) {
    cube.rotation.x -= 0.1;
  }
});

// This will create a loop that causes the renderer to draw the scene every time
//  the screen is refreshed (on a typical screen this means 60 times per second).

/*The callback method is passed a single argument, a DOMHighResTimeStamp,
which indicates the current time
(based on the number of milliseconds since time origin).*/
let previousTime = 0;
let cummalitiveTime = 0;
function animate(currentTime) {
  const delta = currentTime - previousTime;
  cummalitiveTime += delta;
  previousTime = currentTime;

  console.log(cummalitiveTime);
  if (cummalitiveTime > 5000) {
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.001;

  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();