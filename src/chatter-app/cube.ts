import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
document.addEventListener('keydown', function (event) {
  idletime = 0;
  if (event.key === 'ArrowLeft') {
    //left
    cube.rotation.y -= 0.1;
  } else if (event.key === 'ArrowUp') {
    //top
    cube.rotation.x -= 0.1;
  } else if (event.key === 'ArrowRight') {
    //right
    cube.rotation.y += 0.1;
  } else if (event.key === 'ArrowDown') {
    //bottom
    cube.rotation.x += 0.1;
  }
});
let idletime = 0;
function animate() {
  if (idletime > 500) {
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;
  }
  idletime += 1;
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
function ease(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
animate();
