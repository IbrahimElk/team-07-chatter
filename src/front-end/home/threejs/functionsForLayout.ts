// Author: Maité Desmedt, Barteld Van Nieuwenhove
// Date: 25/4/2023
import * as THREE from 'three';
import { scene, buildings, pathTexture } from './layout.js';
import { Heights } from './dataToImport.js';

//functions to create a three in the scene:
export function makeTree(posX: number, posZ: number, kindOfTree: number, size: number) {
  const group = generateTree(kindOfTree, size);
  group.position.x = posX;
  group.position.z = posZ;
  scene.add(group);
}

function generateTree(kindOfTree: number, size: number) {
  const geo = new THREE.Group();
  //const randomNumber = Math.floor(Math.random() * 2); // generates a random integer between 0 and 1
  if (kindOfTree === 1) {
    const oakLeaves = new THREE.IcosahedronGeometry(size, 0);
    oakLeaves.translate(0, size, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const oak = new THREE.Mesh(oakLeaves, material);
    oak.castShadow = true;
    oak.receiveShadow = true;
    geo.add(oak);
  } else {
    const level1 = new THREE.ConeGeometry(1.5, size, 8, 8);
    level1.translate(0, size * 2, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    const cylinder = new THREE.Mesh(level1, material);
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    geo.add(cylinder);
    const level2 = new THREE.ConeGeometry(2, size, 8, 8);
    level2.translate(0, size * 1.5, 0);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    const cylinder2 = new THREE.Mesh(level2, material2);
    cylinder2.castShadow = true;
    cylinder2.receiveShadow = true;
    geo.add(cylinder2);
    const level3 = new THREE.ConeGeometry(3, size, 8, 8);
    const material3 = new THREE.MeshStandardMaterial({ color: 0x00ff60 });
    level3.translate(0, size, 0);
    const cylinder3 = new THREE.Mesh(level3, material3);
    cylinder3.castShadow = true;
    cylinder3.receiveShadow = true;
    geo.add(cylinder3);
  }
  const trunk = new THREE.CylinderGeometry(size / 4, size / 4, size, 4);
  trunk.translate(0, 0, 0);
  const materialtrunk = new THREE.MeshStandardMaterial({ color: 0xbb6600 });
  const cylinder4 = new THREE.Mesh(trunk, materialtrunk);
  cylinder4.castShadow = true;
  cylinder4.receiveShadow = true;
  geo.add(cylinder4);
  geo.scale.set(0.1, 0.1, 0.1);
  return geo;
}

// functions to create material:
export function makeMaterial(mycolor: number): THREE.MeshStandardMaterial {
  const mat: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: mycolor });
  return mat;
}

// functions to create buildings:
export function makeGeo(
  xlength: number,
  height: number,
  zlength: number,
  xpos: number,
  zpos: number
): THREE.BoxGeometry {
  const geo: THREE.BoxGeometry = new THREE.BoxGeometry(xlength, height, zlength);
  geo.translate(xpos, Heights.heightsaver + height * 0.5, zpos);
  return geo;
}

export function makeBench(xpos: number, zpos: number, rotation:number){
    const color = makeMaterial(0x966F33);
    const geotop = new THREE.BoxGeometry(0.18, 0.01, 0.12);
    geotop.translate(0, 0.075, 0);
    const top = new THREE.Mesh(geotop, color);
    top.castShadow = true;
    top.receiveShadow = true;
    const geobenchleft = new THREE.BoxGeometry(0.18, 0.006, 0.045);
    geobenchleft.translate(0, 0.04, -0.07);
    const benchleft = new THREE.Mesh(geobenchleft, color);
    benchleft.castShadow = true;
    benchleft.receiveShadow = true;
    const geobenchright = new THREE.BoxGeometry(0.18, 0.006, 0.045);
    geobenchright.translate(0, 0.04, 0.07);
    const benchright = new THREE.Mesh(geobenchright, color);
    benchright.castShadow = true;
    benchright.receiveShadow = true;
    const legrotation = 75;
    const geolegleftfront = new THREE.BoxGeometry(0.006, 0.09, 0.006);
    geolegleftfront.rotateX(-legrotation);
    geolegleftfront.translate(0.08, 0.035, -0.05);
    const legleftfront = new THREE.Mesh(geolegleftfront, color);
    legleftfront.castShadow = true;
    legleftfront.receiveShadow = true;
    const geolegleftback = new THREE.BoxGeometry(0.006, 0.09, 0.006);
    geolegleftback.rotateX(-legrotation);
    geolegleftback.translate(-0.08, 0.035, -0.05);
    const legleftback = new THREE.Mesh(geolegleftback, color);
    legleftback.castShadow = true;
    legleftback.receiveShadow = true;
    const geolegrightfront = new THREE.BoxGeometry(0.006, 0.09, 0.006);
    geolegrightfront.rotateX(legrotation);
    geolegrightfront.translate(0.08, 0.035, 0.05);
    const legrightfront = new THREE.Mesh(geolegrightfront, color);
    legrightfront.castShadow = true;
    legrightfront.receiveShadow = true;
    const geolegrightback = new THREE.BoxGeometry(0.006, 0.09, 0.006);
    geolegrightback.rotateX(legrotation);
    geolegrightback.translate(-0.08, 0.035, 0.05);
    const legrightback = new THREE.Mesh(geolegrightback, color);
    legrightback.castShadow = true;
    legrightback.receiveShadow = true;
    const bench = new THREE.Group();
    bench.add(top);
    bench.add(benchleft);
    bench.add(benchright);
    bench.add(legleftback);
    bench.add(legleftfront);
    bench.add(legrightback);
    bench.add(legrightfront);
    bench.rotateY(rotation + Math.PI/2);
    bench.position.x = xpos;
    bench.position.z = zpos;
    scene.add(bench);

}

export function finishingTouches(
  building: THREE.Mesh | THREE.Group,
  name: string,
  layer: number,
  castShadowB: boolean
) {
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

// funtions to create a path
export function makePath(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number) {
  // const path = new THREE.Mesh(makePathGeo(xlength, zlength, xpos, zpos, ydregree), makeMaterial(0xfaefd7));
  const repeatx = xlength * 7;
  const repeaty = zlength * 7;
  pathTexture.repeat.set(repeatx, repeaty);
  const path = new THREE.Mesh(
    makePathGeo(xlength, zlength, xpos, zpos, ydregree),
    new THREE.MeshStandardMaterial({ map: pathTexture })
  );
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

export function makeParking(xlength: number, zlength: number, xpos: number, zpos: number, ydregree: number) {
  const parking = new THREE.Mesh(makePathGeo(xlength, zlength, xpos, zpos, ydregree), makeMaterial(0xc7c1c1));
  parking.receiveShadow = true;
  scene.add(parking);
}
