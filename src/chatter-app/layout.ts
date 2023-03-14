/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import {showLabel, hideLabel} from './labels.js';
import {Heights, Dimensions, Positions, BuildingNames} from './dataToImport.js';

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


// construction of the shape and spatial planning of the objects that are part of the buildings
const geoGround = new THREE.PlaneGeometry(25, 20);
geoGround.rotateX(THREE.MathUtils.degToRad(-90));
const geoCentralCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);

const centralCube = new THREE.Mesh(geoCentralCube, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
scene.add(centralCube);
export const ground = new THREE.Mesh(geoGround, new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
ground.receiveShadow = true;
scene.add(ground);

// construction of the buildings + finishing touches (= adding objects to scene + assign layer + castShadow)
const k200 = new THREE.Mesh(makeGeo(Dimensions.dimXk200, Heights.hk200, Dimensions.dimZk200, Positions.posXk200, Positions.posZk200), makeMaterial(0x3b5263));
finishingTouches(k200, BuildingNames.namek200, 1, true);
const acco: THREE.Mesh = new THREE.Mesh(makeGeo(Dimensions.dimXacco, Heights.hacco, Dimensions.dimZacco, Positions.posXacco, Positions.posZacco), makeMaterial(0x3b5263));
finishingTouches(acco, BuildingNames.nameacco, 1, true);
const s200 = new THREE.Mesh(makeGeo(Dimensions.dimXs200, Heights.hs200, Dimensions.dimZs200, Positions.posXs200, Positions.posZs200), makeMaterial(0x3b5263));
finishingTouches(s200, BuildingNames.names200, 1, true);
const m200 = new THREE.Mesh(makeGeo(Dimensions.dimXm200, Heights.hlm200, Dimensions.dimZm200, Positions.posXm200, Positions.posZm200), makeMaterial(0x758694));
finishingTouches(m200, BuildingNames.namem200, 1, true);
const l200 = new THREE.Mesh(makeGeo(Dimensions.dimXl200, Heights.hlm200, Dimensions.dimZl200, Positions.posXl200, Positions.posZl200), makeMaterial(0x758694));
finishingTouches(l200, BuildingNames.namel200, 1, true);
const n200 = new THREE.Mesh(makeGeo(Dimensions.dimXn200, Heights.hn200, Dimensions.dimZn200, Positions.posXn200, Positions.posZn200), makeMaterial(0x758694));
finishingTouches(n200, BuildingNames.namen200, 1, true);
const a200big = new THREE.Mesh(makeGeo(Dimensions.dimXa200big, Heights.ha200, Dimensions.dimZa200big, Positions.posXa200big, Positions.posZa200big), makeMaterial(0xa9aaab));
a200big.layers.set(1);
a200big.castShadow = true;
const a200n = new THREE.Mesh(makeGeo(Dimensions.dimXa200n, Heights.ha200, Dimensions.dimZa200n, Positions.posXa200n, Positions.posZa200n), makeMaterial(0xf52f07));
a200n.layers.set(1);
a200n.castShadow = true;
const a200s = new THREE.Mesh(makeGeo(Dimensions.dimXa200s, Heights.ha200, Dimensions.dimZa200s, Positions.posXa200s, Positions.posZa200s), makeMaterial(0xf52f07));
a200s.layers.set(1);
a200s.castShadow = true;
const a200Group = new THREE.Group();
a200Group.add(a200big);
a200Group.add(a200n);
a200Group.add(a200s);
finishingTouches(a200Group, BuildingNames.namea200, 1, true);
const c200big = new THREE.Mesh(makeGeo(Dimensions.dimXc200big, Heights.hc200, Dimensions.dimZc200big, Positions.posXc200big, Positions.posZc200big), makeMaterial(0xa9aaab));
c200big.layers.set(1);
c200big.castShadow = true;
const c200small = new THREE.Mesh(makeGeo(Dimensions.dimXc200small, Heights.hc200, Dimensions.dimZc200small, Positions.posXc200small, Positions.posZc200small), makeMaterial(0xa9aaab));
c200small.layers.set(1);
c200small.castShadow = true;
const c200med = new THREE.Mesh(makeGeo(Dimensions.dimXc200med, Heights.hc200, Dimensions.dimZc200med, Positions.posXc200med, Positions.posZc200med), makeMaterial(0xa9aaab));
c200med.layers.set(1);
c200med.castShadow = true;
const c200Group = new THREE.Group();
c200Group.add(c200big);
c200Group.add(c200med);
c200Group.add(c200small);
finishingTouches(c200Group, BuildingNames.namec200, 1, true);
const e200 = new THREE.Mesh(makeGeo(Dimensions.dimXe200, Heights.he200, Dimensions.dimZe200, Positions.posXe200, Positions.posZe200), makeMaterial(0xa9aaab));
e200.name = 'e200';
finishingTouches(e200, BuildingNames.namee200, 1, true);
const geoganggeo = new THREE.BoxGeometry(Dimensions.dimXgeogang, Heights.hgeogang, Dimensions.dimZgeogang);
geoganggeo.translate(Positions.posXgeogang, Heights.heightsaver + 0.4, Positions.posZgeogang);
const geogang = new THREE.Mesh(geoganggeo, makeMaterial(0x788f53));
finishingTouches(geogang, BuildingNames.namegeogang, 0, true);

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
  geo.translate(xpos, Heights.heightsaver + height * 0.5, zpos);
  return geo;
}

function makeMaterial(mycolor: number): THREE.MeshStandardMaterial {
  const mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: mycolor });
  return mat;
}

function finishingTouches(building: THREE.Mesh | THREE.Group, name: string, layer: number, castShadowB: boolean) {
  if (building instanceof THREE.Group) {
    building.name = name;
    building.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        building.layers.set(layer);
        building.castShadow = castShadowB;
      }
    });
    scene.add(building);
  }
  if (building instanceof THREE.Mesh) {
    building.layers.set(layer);
    building.castShadow = castShadowB;
    building.name = name;
    scene.add(building);
  }
}

function animate() {
  // hovering
  const raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0 && intersects[0] !== undefined) {
    console.log(intersects[0]);
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED instanceof THREE.Mesh && INTERSECTED) {
        if (INTERSECTED.parent instanceof THREE.Group) {
          hideLabel(INTERSECTED.parent);
          INTERSECTED.parent.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.emissive.setHex(child.material.currentHex);
            }
          });
        } else {
          INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
          hideLabel(INTERSECTED);
        }
      }

      INTERSECTED = intersects[0].object;
      if (INTERSECTED instanceof THREE.Mesh) {
        if (INTERSECTED.parent instanceof THREE.Group) {
          showLabel(INTERSECTED.parent);
          INTERSECTED.parent.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.currentHex = child.material.emissive.getHex();
              child.material.emissive.setHex(0xff0000);
            }
          });
        } else {
          INTERSECTED.material.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xff0000);
          showLabel(INTERSECTED);
        }
      }
    }
  } else {
    if (INTERSECTED instanceof THREE.Mesh) {
      if (INTERSECTED.parent instanceof THREE.Group) {
        hideLabel(INTERSECTED.parent);
        INTERSECTED.parent.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.emissive.setHex(child.material.currentHex);
          }
        });
      } else {
        INTERSECTED.material.emissive.setHex(INTERSECTED.material.currentHex);
        hideLabel(INTERSECTED);
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
