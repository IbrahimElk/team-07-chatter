/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let INTERSECTED: THREE.Object3D<THREE.Event> | null = null;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
//camera.position.set(-17, 31, 33);
camera.position.z = 20;
camera.layers.enable(1);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.renderer.useLegacyLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

//HEIGHTS:
const heightsaver = 0.0001;
const hk200 = 0.5;
const hacco = 0.3;
const hlm200 = 0.5;
const hs200 = 0.7;
const ha200 = 1.1;

const geoGround = new THREE.PlaneGeometry(25, 20);
geoGround.rotateX(THREE.MathUtils.degToRad(-90));
const geoCentralCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const geok200 = new THREE.BoxGeometry(1.3, hk200, 1.9);
geok200.translate(-9.85, heightsaver + hk200 * 0.5, -0.65);
const geoAcco = new THREE.BoxGeometry(0.8, hacco, 3.3);
geoAcco.translate(-11, heightsaver + hacco * 0.5, 0.25);
const geol200 = new THREE.BoxGeometry(1.3, hlm200, 2.0);
geol200.translate(-8.15, heightsaver + hlm200 * 0.5, -3.3);
const geos200 = new THREE.BoxGeometry(0.6, hs200, 1.3);
geos200.translate(-7.2, heightsaver + hs200 * 0.5, -3.65);
const geom200 = new THREE.BoxGeometry(1.8, hlm200, 1.9);
geom200.translate(-6, heightsaver + hlm200 * 0.5, -3.75);
const geoa200 = new THREE.BoxGeometry(0, 0, 0);
makeBuilding('a200', ha200, 3.6, 0.9, -7.2, 1.4);
makeBuilding('a200', ha200, 0.7, 0.1, -7.15, 0.95);
makeBuilding('a200', ha200, 0.7, 0.1, -7.15, 1.9);

const centralCube = new THREE.Mesh(geoCentralCube, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
scene.add(centralCube);
const ground = new THREE.Mesh(geoGround, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
ground.receiveShadow = true;
scene.add(ground);
const k200 = new THREE.Mesh(geok200, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
scene.add(k200);
k200.castShadow = true;
k200.layers.set(1);
const acco = new THREE.Mesh(geoAcco, new THREE.MeshStandardMaterial({ color: 0x000020 }));
scene.add(acco);
acco.castShadow = true;
acco.layers.set(1);
const s200 = new THREE.Mesh(geos200, new THREE.MeshStandardMaterial({ color: 0xdd0022 }));
scene.add(s200);
s200.castShadow = true;
s200.layers.set(1);
const m200 = new THREE.Mesh(geom200, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
scene.add(m200);
m200.castShadow = true;
m200.layers.set(1);
const l200 = new THREE.Mesh(geol200, new THREE.MeshStandardMaterial({ color: 0xff00ff }));
scene.add(l200);
l200.castShadow = true;
l200.layers.set(1);
const a200 = new THREE.Mesh(geoa200, new THREE.MeshStandardMaterial({ color: 0xfcba03 }));
scene.add(a200);
a200.castShadow = true;
a200.layers.set(1);
const m200Div = document.createElement('div');
m200Div.className = 'label';
m200Div.textContent = 'm200';
m200Div.style.marginTop = '-lem';
const m200Label = new CSS2DObject(m200Div);
m200Label.position.set(1.8, hlm200, 1.9);
m200.add(m200Label);

const directionalLight = new THREE.PointLight(0xffffff, 0.5, 100);
directionalLight.castShadow = true;
directionalLight.position.set(0, 10, 4);
scene.add(directionalLight);

//add ambient light
const light = new THREE.AmbientLight(0x404040, 0.8); // soft white light
scene.add(light);

// Create a mouse vector to store the mouse position.
const mouse = new THREE.Vector2();
function onDocumentMouseMove(event: { clientX: number; clientY: number }) {
  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
document.addEventListener('mousemove', onDocumentMouseMove, false);

const controls = new OrbitControls(camera, labelRenderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

function makeBuilding(
  building: string,
  height: number,
  xlength: number,
  zlength: number,
  xtranslate: number,
  ztranslate: number
) {
  const geo = new THREE.BoxGeometry(xlength, height, zlength);
  geo.translate(xtranslate, heightsaver + height * 0.5, ztranslate);
  if (building === 'a200') {
    // geoa200 = mergeBufferGeometries([geo, geoa200]);
  }
}

function animate() {
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0 && intersects[0] !== undefined) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED instanceof THREE.Mesh && INTERSECTED) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
      }

      INTERSECTED = intersects[0].object;
      if (INTERSECTED instanceof THREE.Mesh) {
        INTERSECTED.material.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0xff0000);
      }
    }
  } else {
    if (INTERSECTED instanceof THREE.Mesh) INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
    INTERSECTED = null;
  }

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();
