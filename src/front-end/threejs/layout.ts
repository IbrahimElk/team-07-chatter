/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// @ts-ignore
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { showLabel, hideLabel } from './labels.js';
import { Heights, Dimensions, Positions, BuildingNames } from '../threejs/dataToImport.js';
import { redirect } from './redirect.js';
import { showPopup, hidePopup } from './popup.js';
import { ClientUser } from '../client-dispatcher/client-user.js';

export const scene = new THREE.Scene();
export const buildings = new Array<THREE.Object3D<THREE.Event>>();

// scene.fog = new THREE.Fog(fogColor, 40, 60);
const skyTexture = new THREE.TextureLoader().load('./textures/sky2.jpg');
scene.background = skyTexture;
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 1000);
//camera.position.set(-17*0.75, 31*0.75, 33*0.75);
camera.position.set(-14, 10, -22);
//camera.position.set(0, 10, 0);
//camera.position.z = 20;
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

//disable shadow updates, as they are static, instead call for one single update on first render
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;

// light
const directionalLight = new THREE.PointLight(0xffffff, 0.38, 100);
directionalLight.castShadow = true;
directionalLight.position.set(-3, 10, 4);
scene.add(directionalLight);

//add ambient light
const light = new THREE.AmbientLight(0xd6eaf8, 0.32); // soft white light = 0x404040
scene.add(light);

//textures:
// const pathTexture = new THREE.TextureLoader().load('./threejs/textures/path2.jpeg');
// pathTexture.wrapS = pathTexture.wrapT = THREE.RepeatWrapping;
// const grassTexture = new THREE.TextureLoader().load('./threejs/textures/grass2.jpg');
// grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
// grassTexture.repeat.set(50, 40);
// grassTexture.center.set(0.5, 0.5);

//Construcntion of trees
makeTree(-2.2, -2);
makeTree(-2.2, -2.5);
makeTree(-2.2, -3);
makeTree(-2.2, -3.5);
makeTree(-2.2, -4);
makeTree(-2.2, -4.5);
makeTree(-4.8, -1.5);
makeTree(-2.2, -2.5);
makeTree(5, -3.2);
makeTree(5, -4);
makeTree(4.4, -3.1);
makeTree(3.9, -3.3);
makeTree(4.3, -4.2);
makeTree(-2.2, -2.5);
makeTree(11.5, 4.8);
makeTree(11.55, 4.35);
makeTree(11.55, 4.05);
makeTree(11.5, 3.65);
makeTree(11.45, 3.2);
makeTree(11.55, 2.8);
makeTree(11.85, 4.75);
makeTree(11.85, 4.45);
makeTree(11.9, 3.95);
makeTree(11.95, 3.65);
makeTree(11.9, 3.2);
makeTree(12.35, 4.85);
makeTree(12.25, 4.35);
makeTree(12.3, 4.05);
makeTree(12.25, 3.65);
makeTree(12.35, 3.25);
makeTree(2, -5);
makeTree(2.3, -5.2);
makeTree(1.8, -4.8);
makeTree(-7.1, -2.7);
makeTree(-6, -2.5);
makeTree(-6.5, -2.5);
makeTree(11.5, -0.5);
makeTree(-2, 0.6);
makeTree(-1.8, 0.9);
makeTree(-2.3, 0.4);
makeTree(-11.8, -4.5);

function makeTree(posX: number, posZ: number) {
  const group = generateTree();
  group.position.x = posX;
  group.position.z = posZ;
  scene.add(group);
}

function generateTree() {
  const geo = new THREE.Group();
  const randomNumber = Math.floor(Math.random() * 2); // generates a random integer between 0 and 1
  if (randomNumber === 1) {
    const oakLeaves = new THREE.IcosahedronGeometry(2, 0);
    oakLeaves.translate(0, 2, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const oak = new THREE.Mesh(oakLeaves, material);
    oak.castShadow = true;
    oak.receiveShadow = true;
    geo.add(oak);
  } else {
    const level1 = new THREE.ConeGeometry(1.5, 2, 8, 8);
    level1.translate(0, 4, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    const cylinder = new THREE.Mesh(level1, material);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    geo.add(cylinder);
    const level2 = new THREE.ConeGeometry(2, 2, 8, 8);
    level2.translate(0, 3, 0);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    const cylinder2 = new THREE.Mesh(level2, material2);
    cylinder2.castShadow = true;
    cylinder2.receiveShadow = true;
    geo.add(cylinder2);
    const level3 = new THREE.ConeGeometry(3, 2, 8, 8);
    const material3 = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    level3.translate(0, 2, 0);
    const cylinder3 = new THREE.Mesh(level3, material3);
    cylinder3.castShadow = true;
    cylinder3.receiveShadow = true;
    geo.add(cylinder3);
  }
  const trunk = new THREE.CylinderGeometry(0.5, 0.5, 2, 4);
  trunk.translate(0, 0, 0);
  const materialtrunk = new THREE.MeshStandardMaterial({ color: 0xbb6600 });
  const cylinder4 = new THREE.Mesh(trunk, materialtrunk);
  cylinder4.castShadow = true;
  cylinder4.receiveShadow = true;
  geo.add(cylinder4);
  geo.scale.set(0.1, 0.1, 0.1);
  return geo;
}

// construction of the shape and spatial planning of the objects that are part of the buildings
const geoGround = new THREE.PlaneGeometry(100, 100);
geoGround.rotateX(THREE.MathUtils.degToRad(-90));
//const geoCentralCube = new THREE.BoxGeometry(0.1, 0.1, 0.1);

//construction of paths
makePath(6.4, 0.5, 0.8, -0.45, 0); //1
makePath(0.5, 8.4, -2.65, -1.4, 0); //2
makePath(2, 0.2, -3.9, -1.6, 0); //3
makePath(0.3, 7.4, -5.05, -1.4, 0); //4
makePath(9.6, 0.6, -7.7, 2.5, 0); //5
makePath(9.6, 0.6, -7.7, -5.3, 0); //6
makePath(7.5, 0.2, -8.75, -2, 0); //7
makePath(2, 0.6, -1.9, -5.9, 35); //8
makePath(1.7, 0.5, 4.5, 0, -35); //9
makePath(0.2, 0.7, 5, 1.15, 0); //10
makePath(0.4, 2, 1.9, -1.7, 0); //11
makePath(3.8, 0.2, 4, -2.6, 0); //12
makePath(0.2, 2, 5.8, -3.7, 0); //13
makePath(7.55, 0.6, 8.7, 0.6, 0); //14
makePath(2.2, 0.6, -0.1, -6.5, 0); //15
makePath(4.9, 0.6, 3.25, -5.75, 162); //16
makePath(6.9, 0.6, 8.85, -5, 0); //17

//const centralCube = new THREE.Mesh(geoCentralCube, new THREE.MeshStandardMaterial({ color: 0x0000ff }));
//scene.add(centralCube);
export const ground = new THREE.Mesh(geoGround, new THREE.MeshStandardMaterial({ color: 0x54cf1b }));
// export const ground = new THREE.Mesh(geoGround, new THREE.MeshStandardMaterial({ map: grassTexture }));
ground.receiveShadow = true;
scene.add(ground);

// construction of the buildings + finishing touches (= adding objects to scene + assign layer + castShadow)
const k200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXk200, Heights.hk200, Dimensions.dimZk200, Positions.posXk200, Positions.posZk200),
  makeMaterial(0x3b5263)
);
finishingTouches(k200, BuildingNames.namek200, 1, true);

const acco: THREE.Mesh = new THREE.Mesh(
  makeGeo(Dimensions.dimXacco, Heights.hacco, Dimensions.dimZacco, Positions.posXacco, Positions.posZacco),
  makeMaterial(0x3b5263)
);
finishingTouches(acco, BuildingNames.nameacco, 1, true);

const s200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXs200, Heights.hs200, Dimensions.dimZs200, Positions.posXs200, Positions.posZs200),
  makeMaterial(0x3b5263)
);
finishingTouches(s200, BuildingNames.names200, 1, true);

const m200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXm200, Heights.hlm200, Dimensions.dimZm200, Positions.posXm200, Positions.posZm200),
  makeMaterial(0x758694)
);
finishingTouches(m200, BuildingNames.namem200, 1, true);

const l200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXl200, Heights.hlm200, Dimensions.dimZl200, Positions.posXl200, Positions.posZl200),
  makeMaterial(0x758694)
);
finishingTouches(l200, BuildingNames.namel200, 1, true);

const n200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXn200, Heights.hn200, Dimensions.dimZn200, Positions.posXn200, Positions.posZn200),
  makeMaterial(0x758694)
);
finishingTouches(n200, BuildingNames.namen200, 1, true);

const a200big = new THREE.Mesh(
  makeGeo(Dimensions.dimXa200big, Heights.ha200, Dimensions.dimZa200big, Positions.posXa200big, Positions.posZa200big),
  makeMaterial(0xa9aaab)
);
a200big.layers.set(1);
a200big.castShadow = true;
const a200n = new THREE.Mesh(
  makeGeo(Dimensions.dimXa200n, Heights.ha200, Dimensions.dimZa200n, Positions.posXa200n, Positions.posZa200n),
  makeMaterial(0xf52f07)
);
a200n.layers.set(1);
a200n.castShadow = true;
const a200s = new THREE.Mesh(
  makeGeo(Dimensions.dimXa200s, Heights.ha200, Dimensions.dimZa200s, Positions.posXa200s, Positions.posZa200s),
  makeMaterial(0xf52f07)
);
a200s.layers.set(1);
a200s.castShadow = true;
const a200Group = new THREE.Group();
a200Group.add(a200big);
a200Group.add(a200n);
a200Group.add(a200s);
finishingTouches(a200Group, BuildingNames.namea200, 1, true);

const c200big = new THREE.Mesh(
  makeGeo(Dimensions.dimXc200big, Heights.hc200, Dimensions.dimZc200big, Positions.posXc200big, Positions.posZc200big),
  makeMaterial(0xa9aaab)
);
c200big.layers.set(1);
c200big.castShadow = true;
const c200small = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXc200small,
    Heights.hc200,
    Dimensions.dimZc200small,
    Positions.posXc200small,
    Positions.posZc200small
  ),
  makeMaterial(0xa9aaab)
);
c200small.layers.set(1);
c200small.castShadow = true;
const c200med = new THREE.Mesh(
  makeGeo(Dimensions.dimXc200med, Heights.hc200, Dimensions.dimZc200med, Positions.posXc200med, Positions.posZc200med),
  makeMaterial(0xa9aaab)
);
c200med.layers.set(1);
c200med.castShadow = true;
const c200Group = new THREE.Group();
c200Group.add(c200big);
c200Group.add(c200med);
c200Group.add(c200small);
finishingTouches(c200Group, BuildingNames.namec200, 1, true);

const e200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXe200, Heights.he200, Dimensions.dimZe200, Positions.posXe200, Positions.posZe200),
  makeMaterial(0xa9aaab)
);
finishingTouches(e200, BuildingNames.namee200, 1, true);

const geoganggeo = new THREE.BoxGeometry(Dimensions.dimXgeogang, Heights.hgeogang, Dimensions.dimZgeogang);
geoganggeo.translate(Positions.posXgeogang, Heights.heightsaver + 0.4, Positions.posZgeogang);
const geogang = new THREE.Mesh(geoganggeo, makeMaterial(0x788f53));
finishingTouches(geogang, BuildingNames.namegeogang, 0, true);

const b200big = new THREE.Mesh(
  makeGeo(Dimensions.dimXb200big, Heights.hb200, Dimensions.dimZb200big, Positions.posXb200big, Positions.posZb200big),
  makeMaterial(0x3b5263)
);
b200big.layers.set(1);
b200big.castShadow = true;
const b200small = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXb200small,
    Heights.hb200,
    Dimensions.dimZb200small,
    Positions.posXb200small,
    Positions.psoZb200small
  ),
  makeMaterial(0x3b5263)
);
b200small.layers.set(1);
b200small.castShadow = true;
const b200med = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXb200med,
    Heights.hb200med,
    Dimensions.dimZb200med,
    Positions.posXb200med,
    Positions.posZb200med
  ),
  makeMaterial(0x3b5263)
);
b200med.layers.set(1);
b200med.castShadow = true;
const b200Group = new THREE.Group();
b200Group.add(b200big);
b200Group.add(b200med);
b200Group.add(b200small);
finishingTouches(b200Group, BuildingNames.nameb200, 1, true);

const monibig = new THREE.Mesh(
  makeGeo(Dimensions.dimXmonibig, Heights.hmoni, Dimensions.dimZmonibig, Positions.posXmonibig, Positions.posZmonibig),
  makeMaterial(0xa9aaab)
);
monibig.layers.set(1);
monibig.castShadow = true;
const monismallgeo = new THREE.BoxGeometry(Dimensions.dimXmonismall, Heights.hmoni - 0.3, Dimensions.dimZmonismall);
monismallgeo.translate(
  Positions.posXmonismall,
  Heights.heightsaver + 0.15 + Heights.hmoni * 0.5,
  Positions.posZmonismall
);
const monismall = new THREE.Mesh(monismallgeo, makeMaterial(0xa9aaab));
monismall.layers.set(1);
monismall.castShadow = true;
const moniGroup = new THREE.Group();
moniGroup.add(monibig);
moniGroup.add(monismall);
finishingTouches(moniGroup, BuildingNames.namemoni, 1, true);

const f200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXf200, Heights.hf200, Dimensions.dimZf200, Positions.posXf200, Positions.posZf200),
  makeMaterial(0xa9aaab)
);
finishingTouches(f200, BuildingNames.namef200, 1, true);

const h200 = new THREE.Mesh(
  makeGeo(Dimensions.dimXh200, Heights.hh200, Dimensions.dimZh200, Positions.posXh200, Positions.posZh200),
  makeMaterial(0xa9aaab)
);
finishingTouches(h200, BuildingNames.nameh200, 1, true);

const nanobig = new THREE.Mesh(
  makeGeo(Dimensions.dimXnanobig, Heights.hnano, Dimensions.dimZnanobig, Positions.posXnanobig, Positions.posZnanobig),
  makeMaterial(0x3b5263)
);
nanobig.layers.set(1);
nanobig.castShadow = true;
const nanosmall = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXnanosmall,
    Heights.hnano,
    Dimensions.dimZnanosmall,
    Positions.posXnanosmall,
    Positions.posZnanosmall
  ),
  makeMaterial(0x3b5263)
);
nanosmall.layers.set(1);
nanosmall.castShadow = true;
const nanoGroup = new THREE.Group();
nanoGroup.add(nanobig);
nanoGroup.add(nanosmall);
finishingTouches(nanoGroup, BuildingNames.namenano, 0, true);

const d200long = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200long,
    Heights.hd200l,
    Dimensions.dimZd200long,
    Positions.posXd200long,
    Positions.posZd200long
  ),
  makeMaterial(0xc4bea5)
);
d200long.layers.set(1);
d200long.castShadow = true;
const d200big1 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200big1,
    Heights.hd200b,
    Dimensions.dimZd200big1,
    Positions.posXd200big1,
    Positions.posZd200big1
  ),
  makeMaterial(0xa9aaab)
);
d200big1.layers.set(1);
d200big1.castShadow = true;
const d200big2 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200big2,
    Heights.hd200b,
    Dimensions.dimZd200big2,
    Positions.posXd200big2,
    Positions.posZd200big2
  ),
  makeMaterial(0xa9aaab)
);
d200big2.layers.set(1);
d200big2.castShadow = true;
const d200small1 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200small1,
    Heights.hd200,
    Dimensions.dimZd200small1,
    Positions.posXd200small1,
    Positions.posZd200small1
  ),
  makeMaterial(0xa9aaab)
);
d200small1.layers.set(1);
d200small1.castShadow = true;
const d200small2 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200small2,
    Heights.hd200,
    Dimensions.dimZd200small2,
    Positions.posXd200small2,
    Positions.posZd200small2
  ),
  makeMaterial(0xa9aaab)
);
d200small2.layers.set(1);
d200small2.castShadow = true;
const d200small3 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200small3,
    Heights.hd200,
    Dimensions.dimZd200small3,
    Positions.posXd200small3,
    Positions.posZd200small3
  ),
  makeMaterial(0xa9aaab)
);
d200small3.layers.set(1);
d200small3.castShadow = true;
const d200small4 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200small4,
    Heights.hd200,
    Dimensions.dimZd200small4,
    Positions.posXd200small4,
    Positions.posZd200small4
  ),
  makeMaterial(0xa9aaab)
);
d200small4.layers.set(1);
d200small4.castShadow = true;
const d200small5 = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200small5,
    Heights.hd200,
    Dimensions.dimZd200small5,
    Positions.posXd200small5,
    Positions.posZd200small5
  ),
  makeMaterial(0xa9aaab)
);
d200small5.layers.set(1);
d200small5.castShadow = true;
const d200mini = new THREE.Mesh(
  makeGeo(
    Dimensions.dimXd200mini,
    Heights.hd200,
    Dimensions.dimZd200mini,
    Positions.posXd200mini,
    Positions.posZd200mini
  ),
  makeMaterial(0xa9aaab)
);
d200mini.layers.set(1);
d200mini.castShadow = true;
const d200Group = new THREE.Group();
d200Group.add(d200long);
d200Group.add(d200big1);
d200Group.add(d200big2);
d200Group.add(d200small1);
d200Group.add(d200small2);
d200Group.add(d200small3);
d200Group.add(d200small4);
d200Group.add(d200small5);
d200Group.add(d200mini);
finishingTouches(d200Group, BuildingNames.named200, 1, true);

const qdvlang = new THREE.Mesh(
  makeGeo(Dimensions.dimXqdvlang, Heights.hqdv, Dimensions.dimZqdvlang, Positions.posXqdvlang, Positions.posZqdvlang),
  makeMaterial(0x3b5263)
);
qdvlang.layers.set(1);
qdvlang.castShadow = true;
const qdvsqaureGeo = new THREE.BoxGeometry(Dimensions.dimXqdvsquare, Heights.hqdv, Dimensions.dimZqdvsquare);
qdvsqaureGeo.rotateY(35);
qdvsqaureGeo.translate(Positions.posXqdvsquare, Heights.heightsaver + Heights.hqdv * 0.5, Positions.posZqdvsquare);
const qdvsquare = new THREE.Mesh(qdvsqaureGeo, makeMaterial(0x3b5263));
qdvsquare.layers.set(1);
qdvsquare.castShadow = true;
const qdvGroup = new THREE.Group();
qdvGroup.add(qdvlang);
qdvGroup.add(qdvsquare);
finishingTouches(qdvGroup, BuildingNames.nameqdv, 1, true);

const g200b = new THREE.Mesh(
  makeGeo(Dimensions.dimXg200b, Heights.hg200b, Dimensions.dimZg200b, Positions.posXg200b, Positions.posZg200b),
  makeMaterial(0xa9aaab)
);
g200b.layers.set(1);
g200b.castShadow = true;
const g200s = new THREE.Mesh(
  makeGeo(Dimensions.dimXg200s, Heights.hg200s, Dimensions.dimZg200s, Positions.posXg200s, Positions.posZg200s),
  makeMaterial(0xa9aaab)
);
g200s.layers.set(1);
g200s.castShadow = true;
const g200m = new THREE.Mesh(
  makeGeo(Dimensions.dimXg200m, Heights.hg200m, Dimensions.dimZg200m, Positions.posXg200m, Positions.posZg200m),
  makeMaterial(0xa9aaab)
);
g200m.layers.set(1);
g200m.castShadow = true;
const g200Group = new THREE.Group();
g200Group.add(g200b);
g200Group.add(g200m);
g200Group.add(g200s);
finishingTouches(g200Group, BuildingNames.nameg200, 1, true);

function makeGeo(xlength: number, height: number, zlength: number, xpos: number, zpos: number): THREE.BoxGeometry {
  const geo: THREE.BoxGeometry = new THREE.BoxGeometry(xlength, height, zlength);
  geo.translate(xpos, Heights.heightsaver + height * 0.5, zpos);
  return geo;
}

function makeMaterial(mycolor: number): THREE.MeshStandardMaterial {
  const mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: mycolor });
  return mat;
}

function makePath(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number) {
  const path = new THREE.Mesh(makePathGeo(xlength, zlength, xpos, zpos, ydregree), makeMaterial(0xfaefd7));
  // const repeatx = xlength * 7;
  // const repeaty = zlength * 7;
  // pathTexture.repeat.set(repeatx, repeaty);
  // const path = new THREE.Mesh(
  //   makePathGeo(xlength, zlength, xpos, zpos, ydregree),
  //   new THREE.MeshStandardMaterial({ map: pathTexture })
  // );
  path.receiveShadow = true;
  scene.add(path);
}

function makePathGeo(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number) {
  const geo = new THREE.PlaneGeometry(xlength, zlength);
  geo.rotateX(THREE.MathUtils.degToRad(-90));
  geo.rotateY(THREE.MathUtils.degToRad(ydregree));
  geo.translate(xpos, Heights.heightsaverPath, zpos);
  return geo;
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
  }
  if (building instanceof THREE.Mesh) {
    building.layers.set(layer);
    building.castShadow = castShadowB;
    building.name = name;
  }
  scene.add(building);
  buildings.push(building);
}

//enables user to move the camera when dragging the mouse:
let drag = false;
document.addEventListener('mouseup', (event) => {
  if (!drag) {
    onDocumentMouseClick(event);
  }
  drag = false;
});
document.addEventListener('mousedown', () => (drag = false));
document.addEventListener('mousemove', (event) => {
  drag = true;
  onDocumentMouseMove(event);
});
// Create a mouse vector to store the mouse position.
let intersected: THREE.Object3D<THREE.Event> | null = null;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
raycaster.layers.set(1);

function onDocumentMouseClick(event: { clientX: number; clientY: number }) {
  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const clicked3DObject = intersects.length > 0 && intersects[0] !== undefined ? intersects[0].object : null;

  if (clicked3DObject) {
    handleClick(clicked3DObject);
  }
}

function onDocumentMouseMove(event: { clientX: number; clientY: number }) {
  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // hovering
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const newIntersected = intersects.length > 0 && intersects[0] !== undefined ? intersects[0].object : null;

  //Changed to different object
  if (newIntersected !== intersected) {
    if (intersected) {
      resetIntersected(intersected);
    }
    intersected = newIntersected;
    if (intersected) {
      showIntersected(intersected);
    }
  }
}

function showIntersected(object: THREE.Object3D<THREE.Event>) {
  showLabel(object);
  showPopup(object);
  highlightObject(object, 0xff0000);
}

function resetIntersected(object: THREE.Object3D<THREE.Event>) {
  hideLabel(object);
  hidePopup();
  unHighlightObject(object);
}

function handleClick(object: THREE.Object3D<THREE.Event>) {
  showLabel(object);
  showPopup(object);
  highlightObject(object, 0xff00ff);
  redirect(object);
}

function highlightObject(object: THREE.Object3D<THREE.Event>, hex: any) {
  if (object.parent instanceof THREE.Group) {
    object.parent.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.currentHex = child.material.emissive.getHex();
        child.material.emissive.setHex(hex);
      }
    });
    return;
  }
  if (object instanceof THREE.Mesh) {
    object.material.currentHex = object.material.emissive.getHex();
    object.material.emissive.setHex(hex);
  }
  if (object instanceof THREE.Group) {
    object.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        highlightObject(child, hex);
      }
    });
  }
}

function unHighlightObject(object: THREE.Object3D<THREE.Event>) {
  if (object.parent instanceof THREE.Group) {
    object.parent.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.emissive.setHex(child.material.currentHex);
      }
    });
    return;
  }
  if (object instanceof THREE.Mesh) {
    object.material.emissive.setHex(object.material.currentHex);
  }
  if (object instanceof THREE.Group) {
    object.children.forEach((child) => {
      unHighlightObject(child);
    });
  }
}

const controls = new OrbitControls(camera, labelRenderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;
controls.minDistance = 16;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2 - 0.02;

function highlightCurrentClass() {
  let building;
  for (const object of getBuildings()) {
    if (object.name === ClientUser.getCurrentClassRoom()?.building) {
      building = object;
    }
  }
  if (building !== undefined) {
    highlightObject(building, 0xff00ff);
  }
}
highlightCurrentClass();
setInterval(highlightCurrentClass, 60000);

export function getBuildings(): THREE.Object3D<THREE.Event>[] {
  return buildings;
}

function render() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

animate();
