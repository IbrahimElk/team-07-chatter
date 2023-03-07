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
scene.background = new THREE.Color(0xb6d2e0);
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

// construction of the shape and spatial planning of the objects that are part of the buildings
const geoGround = new THREE.PlaneGeometry(25, 20);
geoGround.rotateX(THREE.MathUtils.degToRad(-90));
const geoCentralCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);

const centralCube = new THREE.Mesh(geoCentralCube, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
scene.add(centralCube);
const ground = new THREE.Mesh(geoGround, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
ground.receiveShadow = true;
scene.add(ground);

// construction of the buildings + finishing touches (= adding objects to scene + assign layer + castShadow) 
const k200 = new THREE.Mesh(makeGeo(1.3, hk200, 1.9, -9.85, -0.65), makeMaterial(0x3b5263));
finishingTouches(k200, 1, true);
const acco = new THREE.Mesh(makeGeo(0.8, hacco, 3.3, -11, 0.25), makeMaterial(0x3b5263));
finishingTouches(acco, 1, true);
const s200 = new THREE.Mesh(makeGeo(0.6, hs200, 1.3, -7.2, -3.65), makeMaterial(0x3b5263));
finishingTouches(s200, 1, true);
const m200 = new THREE.Mesh(makeGeo(1.8, hlm200, 1.9, -6, -3.75), makeMaterial(0x758694 ));
finishingTouches(m200, 1, true);
const l200 = new THREE.Mesh(makeGeo(1.3, hlm200, 2.0, -8.15, -3.3), makeMaterial(0x758694 ));
finishingTouches(l200, 1, true);
const a200big = new THREE.Mesh(makeGeo(3.6, ha200, 0.9, -7.2, 1.4), makeMaterial(0xa9aaab));
const a200n = new THREE.Mesh(makeGeo(0.7, ha200, 0.1, -7.15, 0.95), makeMaterial(0xf52f07));
const a200s = new THREE.Mesh(makeGeo(0.7, ha200, 0.1, -7.15, 1.9), makeMaterial(0xf52f07));
const a200Group = new THREE.Group();
a200Group.add(a200big);
a200Group.add(a200n);
a200Group.add(a200s);
finishingTouches(a200Group, 1, true);

// labels for the buildings 
const m200Div = document.createElement('div');
m200Div.className = 'label';
m200Div.textContent = '200M';
m200Div.style.marginTop = '-lem';
m200Div.style.color = "black" ;
const m200Label = new CSS2DObject(m200Div);
m200Label.position.set(-6, hlm200*1.5, -3.75);
m200.add(m200Label);

// light and shadow
const directionalLight = new THREE.PointLight(0xffffff, 0.5, 100);
directionalLight.castShadow = true;
directionalLight.position.set(0, 10, 4);
scene.add(directionalLight);

//add ambient light
const light = new THREE.AmbientLight(0x404040, 0.8); // soft white light
scene.add(light);

//enables user to move the camera when dragging the mouse:
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


function makeGeo(xlength:number, height: number, zlength:number, xpos:number, zpos:number){
  const geo = new THREE.BoxGeometry(xlength, height, zlength);
  geo.translate(xpos, heightsaver + height * 0.5, zpos);
  return geo;
}

function makeMaterial(mycolor:number){
  return new THREE.MeshStandardMaterial({ color: mycolor })
}

function finishingTouches(building: THREE.Mesh | THREE.group, layer:number, castShadowB:Boolean){
  building.layers.set(layer);
  building.castShadow = castShadowB;
  scene.add(building);
}

function animate() {
  // hovering
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
