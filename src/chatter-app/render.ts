import * as THREE from 'three';
import { KeyPressHandler, easeInOutQuad } from './functions.js';
const scene = new THREE.Scene();
// The first attribute is the field of view. FOV is the extent of the scene that is seen on the display at any given moment. The value is in degrees
// the window is the application window (bv. lengte en breedte van google chrome tab)
// The next two attributes are the near and far clipping plane. What that means, is that objects further away from the camera than the value of far or closer than near won't be rendered.
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
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

// const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2));
// const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x17202a }));
// cube.add(line);

//add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.castShadow = true;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//add ambient light
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

//move the camera
camera.position.z = 5;

scene.background = null;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// timer for timed motion events
const timer = { time: Date.now() };

// This will create a loop that causes the renderer to draw the scene every time
// the screen is refreshed (on a typical screen this means 60 times per second).
// if 3 seconds have passed, without any keypress, the cube animation will start on its own.
export function animate() {
  if (timer.time < Date.now() - 3000) {
    const delta = Date.now() - timer.time;
    const progress = Math.min(delta / 15000, 1);
    const easedProgress = easeInOutQuad(progress);
    // console.log(easedProgress);
    cube.rotation.x += 0.04 * easedProgress;
    cube.rotation.y -= 0.04 * easedProgress;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

KeyPressHandler(document, cube, timer);
animate();
