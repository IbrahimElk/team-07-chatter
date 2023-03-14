/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as JQUERY from 'jquery';
//import {showLabel, hideLabel} from './labels.js';

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
const hc200 = 0.5;
const hgeogang = 0.2;
const he200 = 1.1;
const hn200 = 0.5;

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
finishingTouches(k200, '200 K', 1, true);
export const acco: THREE.Mesh = new THREE.Mesh(makeGeo(0.8, hacco, 3.3, -11, 0.25), makeMaterial(0x3b5263));
finishingTouches(acco, 'ACCO', 1, true);
const s200 = new THREE.Mesh(makeGeo(0.6, hs200, 1.3, -7.2, -3.65), makeMaterial(0x3b5263));
finishingTouches(s200, '200 S', 1, true);
const m200 = new THREE.Mesh(makeGeo(1.8, hlm200, 1.9, -6, -3.75), makeMaterial(0x758694));
finishingTouches(m200, '200 M', 1, true);
const l200 = new THREE.Mesh(makeGeo(1.3, hlm200, 2.0, -8.15, -3.3), makeMaterial(0x758694));
finishingTouches(l200, '200 L', 1, true);
const n200 = new THREE.Mesh(makeGeo(1.3, hn200, 0.6, -4.25, -2.4), makeMaterial(0x758694));
finishingTouches(n200, '200 N', 1, true);
const a200big = new THREE.Mesh(makeGeo(3.6, ha200, 0.9, -7.2, 1.4), makeMaterial(0xa9aaab));
a200big.layers.set(1);
a200big.castShadow = true;
const a200n = new THREE.Mesh(makeGeo(0.7, ha200, 0.1, -7.15, 0.95), makeMaterial(0xf52f07));
a200n.layers.set(1);
a200n.castShadow = true;
const a200s = new THREE.Mesh(makeGeo(0.7, ha200, 0.1, -7.15, 1.9), makeMaterial(0xf52f07));
a200s.layers.set(1);
a200s.castShadow = true;
const a200Group = new THREE.Group();
a200Group.add(a200big);
a200Group.add(a200n);
a200Group.add(a200s);
finishingTouchesGroup(a200Group, '200 A');
const c200big = new THREE.Mesh(makeGeo(3.6, hc200, 1.6, -2, 2.6), makeMaterial(0xa9aaab));
c200big.layers.set(1);
c200big.castShadow = true;
const c200small = new THREE.Mesh(makeGeo(0.4, hc200, 0.5, -0.5, 1.55), makeMaterial(0xa9aaab));
c200small.layers.set(1);
c200small.castShadow = true;
const c200med = new THREE.Mesh(makeGeo(2.5, hc200, 0.7, -0.05, 0.95), makeMaterial(0xa9aaab));
c200med.layers.set(1);
c200med.castShadow = true;
const c200Group = new THREE.Group();
c200Group.add(c200big);
c200Group.add(c200med);
c200Group.add(c200small);
finishingTouchesGroup(c200Group, '200 A');
const e200 = new THREE.Mesh(makeGeo(1.4, he200, 4.9, 2.9, 2.65), makeMaterial(0xa9aaab));
e200.name = 'e200';
finishingTouches(e200, '200 E', 1, true);
const geoganggeo = new THREE.BoxGeometry(1, hgeogang, 0.7);
geoganggeo.translate(1.7, heightsaver + 0.4, 0.95);
const geogang = new THREE.Mesh(geoganggeo, makeMaterial(0x788f53));
finishingTouches(geogang, 'GEOGANG', 0, true);

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

function makeGeo(xlength: number, height: number, zlength: number, xpos: number, zpos: number): THREE.BoxGeometry {
  const geo: THREE.BoxGeometry = new THREE.BoxGeometry(xlength, height, zlength);
  geo.translate(xpos, heightsaver + height * 0.5, zpos);
  return geo;
}

function makeMaterial(mycolor: number): THREE.MeshStandardMaterial {
  const mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: mycolor });
  return mat;
}

function finishingTouches(building: THREE.Mesh, name: string, layer: number, castShadowB: boolean) {
  building.layers.set(layer);
  building.castShadow = castShadowB;
  building.name = name;
  scene.add(building);
}

function finishingTouchesGroup(building: THREE.Group, name: string) {
  building.layers.set(1);
  building.name = name;
  scene.add(building);
}

// function makeLabel(element:HTMLDivElement, text:string, color:string):CSS2DObject{
//   element.className = 'label';
//   element.textContent = text;
//   element.style.marginTop = '-lem';
//   element.style.color = color;
//   const label:CSS2DObject = new CSS2DObject(element);
//   return label;
// }

// labels for the buildings
const m200Div = document.createElement('div');
const m200Label = makeLabel(m200Div, '200M', 'black');
m200Label.position.set(-6, hlm200 * 1.5, -3.75);
//m200.add(m200Label);

const s200Div = document.createElement('div');
const s200Label = makeLabel(s200Div, '200S', 'black');
s200Label.position.set(-7.2, hs200 * 1.5, -3.65);
//s200.add(s200Label);

const l200Div = document.createElement('div');
const l200Label = makeLabel(l200Div, '200L', 'black');
l200Label.position.set(-8.15, hlm200 * 1.5, -3.3);
//l200.add(l200Label);

const k200Div = document.createElement('div');
const k200Label = makeLabel(k200Div, '200K', 'black');
k200Label.position.set(-9.85, hk200 * 1.5, -0.65);
//k200.add(k200Label);

const a200Div = document.createElement('div');
const a200Label = makeLabel(a200Div, '200A', 'black');
a200Label.position.set(-7.2, ha200 * 1.5, 1.4);
//a200Group.add(a200Label);

const accoDiv = document.createElement('div');
const accoLabel: CSS2DObject = makeLabel(accoDiv, 'ACCO', 'black');
accoLabel.position.set(-11, hacco * 1.5, 0.25);
//acco.add(accoLabel);

const n200Div = document.createElement('div');
const n200Label = makeLabel(n200Div, '200N', 'black');
n200Label.position.set(-4.25, hn200 * 1.5, -2.4);
//n200.add(n200Label);

const e200Div: HTMLDivElement = document.createElement('div');
const e200Label = makeLabel(e200Div, '200E', 'black');
e200Label.position.set(2.9, he200 * 1.5, 2.65);
//e200.add(e200Label);

const c200Div = document.createElement('div');
const c200Label = makeLabel(c200Div, '200C', 'black');
c200Label.position.set(-2, hc200 * 1.5, 2.6);
//c200Group.add(c200Label);

function makeLabel(element: HTMLDivElement, text: string, color: string): CSS2DObject {
  element.className = 'label';
  element.textContent = text;
  element.style.marginTop = '-lem';
  element.style.color = color;
  const label: CSS2DObject = new CSS2DObject(element);
  return label;
}

export function showLabel(building: THREE.Mesh | THREE.Group) {
  switch (building) {
    case acco:
      acco.add(accoLabel);
      break;
    case a200Group:
      a200Group.add(a200Label);
      break;
    case c200Group:
      c200Group.add(c200Label);
      break;
    case e200:
      e200.add(e200Label);
      break;
    case k200:
      k200.add(k200Label);
      break;
    case l200:
      l200.add(l200Label);
      break;
    case m200:
      m200.add(m200Label);
      break;
    case n200:
      n200.add(n200Label);
      break;
    case s200:
      s200.add(s200Label);
      break;
    default:
      break;
  }
}
export function hideLabel(building: THREE.Mesh | THREE.Group) {
  switch (building) {
    case acco:
      acco.remove(accoLabel);
      break;
    case a200Group:
      a200Group.remove(a200Label);
      break;
    case c200Group:
      c200Group.remove(c200Label);
      break;
    case e200:
      e200.remove(e200Label);
      break;
    case k200:
      k200.remove(k200Label);
      break;
    case l200:
      l200.remove(l200Label);
      break;
    case m200:
      m200.remove(m200Label);
      break;
    case n200:
      n200.remove(n200Label);
      break;
    case s200:
      s200.remove(s200Label);
      break;
    default:
      break;
  }
}

function animate() {
  // hovering
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, false);
  if (intersects.length > 0 && intersects[0] !== undefined) {
    console.log(intersects[0]);
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED instanceof THREE.Mesh && INTERSECTED) {
        if (INTERSECTED.parent instanceof THREE.Group) {
          INTERSECTED.parent.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.emissive.setHex(child.material.currentHex);
            }
          });
        } else {
          INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
        }
      }

      INTERSECTED = intersects[0].object;
      if (INTERSECTED instanceof THREE.Mesh) {
        if (INTERSECTED.parent instanceof THREE.Group) {
          INTERSECTED.parent.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.currentHex = child.material.emissive.getHex();
              child.material.emissive.setHex(0xff0000);
            }
          });
        } else {
          INTERSECTED.material.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xff0000);
        }
      }
    }
  } else {
    if (INTERSECTED instanceof THREE.Mesh) {
      if (INTERSECTED.parent instanceof THREE.Group) {
        INTERSECTED.parent.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.emissive.setHex(child.material.currentHex);
          }
        });
      } else {
        INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
      }
    }
    INTERSECTED = null;
  }
  // if (intersects.length > 0 && intersects[0] !== undefined) {
  //   if (INTERSECTED !== intersects[0].object) {
  //     if (INTERSECTED instanceof THREE.Mesh && INTERSECTED) {
  //       INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
  //       hideLabel(INTERSECTED);
  //       $( ".text" ).empty();
  //     }

  //     INTERSECTED = intersects[0].object;
  //     if (INTERSECTED instanceof THREE.Mesh) {
  //       INTERSECTED.material.currentHex = INTERSECTED.material.emissive.getHex();
  //       INTERSECTED.material.emissive.setHex(0xff0000);
  //       showLabel(INTERSECTED);
  //       const namee: string = INTERSECTED.name;
  //       console.log(namee);
  //       console.log("testttt");
  //       $( ".text" ).empty();
  //       $( ".popup" ).append( "<div class='text'><p>This is building " +  namee +" and there are no lessons given in this building at the moment <strong>" + "</strong></p></div>" );
  //       $(".popup").show();
  //     }
  //   }
  // } else {
  //   if (INTERSECTED instanceof THREE.Mesh) {
  //     INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
  //     hideLabel(INTERSECTED);
  //     $( ".text" ).empty();
  //   }
  //   INTERSECTED = null;
  // }

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();
