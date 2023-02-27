/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as THREE from 'three';
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
let timer = Date.now();

export function KeyPressHandler(
  documentParam: Document,
  Kubus: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>
) {
  documentParam.addEventListener('keydown', function (event) {
    timer = Date.now();
    if (event.code === 'ArrowRight') {
      Kubus.rotation.y += 0.1;
    } else if (event.code === 'ArrowUp') {
      Kubus.rotation.x -= 0.1;
    } else if (event.code === 'ArrowLeft') {
      Kubus.rotation.y -= 0.1;
    } else if (event.code === 'ArrowDown') {
      Kubus.rotation.x += 0.1;
    }
  });
}

// This will create a loop that causes the renderer to draw the scene every time
//  the screen is refreshed (on a typical screen this means 60 times per second).

export function animate() {
  const elapsedTime = timer - Date.now();

  if (timer < Date.now() - 3000) {
    cube.rotation.x += Math.min(easeInOutQuad(elapsedTime / 100000), 0.04);
    cube.rotation.y += Math.min(easeInOutQuad(elapsedTime / 100000), 0.04);
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

export function easeInOutQuad(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

KeyPressHandler(document, cube);
animate();
