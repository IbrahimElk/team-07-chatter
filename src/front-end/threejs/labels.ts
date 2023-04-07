/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { ground } from './layout.js';
import { Heights, Positions, BuildingNames } from '../threejs/dataToImport.js';

// labels for the buildings
const m200Div = document.createElement('div');
const m200Label = makeLabel(m200Div, BuildingNames.namem200, 'black');
m200Label.position.set(Positions.posXm200, Heights.hlm200 * 1.5, Positions.posZm200);

const s200Div = document.createElement('div');
const s200Label = makeLabel(s200Div, BuildingNames.names200, 'black');
s200Label.position.set(Positions.posXs200, Heights.hs200 * 1.5, Positions.posZs200);

const l200Div = document.createElement('div');
const l200Label = makeLabel(l200Div, BuildingNames.namel200, 'black');
l200Label.position.set(Positions.posXl200, Heights.hlm200 * 1.5, Positions.posZl200);

const k200Div = document.createElement('div');
const k200Label = makeLabel(k200Div, BuildingNames.namek200, 'black');
k200Label.position.set(Positions.posXk200, Heights.hk200 * 1.5, Positions.posZk200);

const a200Div = document.createElement('div');
const a200Label = makeLabel(a200Div, BuildingNames.namea200, 'black');
a200Label.position.set(Positions.posXa200big, Heights.ha200 * 1.5, Positions.posZa200big);

const accoDiv = document.createElement('div');
const accoLabel: CSS2DObject = makeLabel(accoDiv, BuildingNames.nameacco, 'black');
accoLabel.position.set(Positions.posXacco, Heights.hacco * 1.5, Positions.posZacco);

const n200Div = document.createElement('div');
const n200Label = makeLabel(n200Div, BuildingNames.namen200, 'black');
n200Label.position.set(Positions.posXn200, Heights.hn200 * 1.5, Positions.posZn200);

const e200Div: HTMLDivElement = document.createElement('div');
const e200Label = makeLabel(e200Div, BuildingNames.namee200, 'black');
e200Label.position.set(Positions.posXe200, Heights.he200 * 1.5, Positions.posZe200);

const c200Div = document.createElement('div');
const c200Label = makeLabel(c200Div, BuildingNames.namec200, 'black');
c200Label.position.set(Positions.posXc200big, Heights.hc200 * 1.5, Positions.posZc200big);

const b200Div = document.createElement('div');
const b200Label = makeLabel(b200Div, BuildingNames.nameb200, 'black');
b200Label.position.set(Positions.posXb200big, Heights.hb200 * 1.5, Positions.posZb200big);

const moniDiv = document.createElement('div');
const moniLabel = makeLabel(moniDiv, BuildingNames.namemoni, 'black');
moniLabel.position.set(Positions.posXmonibig, Heights.hmoni * 1.5, Positions.posZmonibig);

const f200Div = document.createElement('div');
const f200Label = makeLabel(f200Div, BuildingNames.namef200, 'black');
f200Label.position.set(Positions.posXf200, Heights.hf200 * 1.5, Positions.posZf200);

const h200Div = document.createElement('div');
const h200Label = makeLabel(h200Div, BuildingNames.nameh200, 'black');
h200Label.position.set(Positions.posXh200, Heights.hh200 * 1.5, Positions.posZh200);

const nanoDiv = document.createElement('div');
const nanoLabel = makeLabel(nanoDiv, BuildingNames.namenano, 'black');
nanoLabel.position.set(Positions.posXnanobig, Heights.hnano * 1.5, Positions.posZnanobig);

const d200Div = document.createElement('div');
const d200Label = makeLabel(d200Div, BuildingNames.named200, 'black');
d200Label.position.set(Positions.posXd200long, Heights.hd200 * 1.5, Positions.posZd200long);

function makeLabel(element: HTMLDivElement, text: string, color: string): CSS2DObject {
  element.className = 'label';
  element.textContent = text;
  element.style.marginTop = '-lem';
  element.style.color = color;
  const label: CSS2DObject = new CSS2DObject(element);
  return label;
}

export function showLabel(building: THREE.Mesh | THREE.Group) {
  switch (building.name) {
    case BuildingNames.nameacco:
      ground.add(accoLabel);
      break;
    case BuildingNames.namea200:
      ground.add(a200Label);
      break;
    case BuildingNames.namec200:
      ground.add(c200Label);
      break;
    case BuildingNames.namee200:
      ground.add(e200Label);
      break;
    case BuildingNames.namek200:
      ground.add(k200Label);
      break;
    case BuildingNames.namel200:
      ground.add(l200Label);
      break;
    case BuildingNames.namem200:
      ground.add(m200Label);
      break;
    case BuildingNames.namen200:
      ground.add(n200Label);
      break;
    case BuildingNames.names200:
      ground.add(s200Label);
      break;
    case BuildingNames.nameb200:
      ground.add(b200Label);
      break;
    case BuildingNames.namemoni:
      ground.add(moniLabel);
      break;
    case BuildingNames.namef200:
      ground.add(f200Label);
      break;
    case BuildingNames.nameh200:
      ground.add(h200Label);
      break;
    case BuildingNames.namenano:
      ground.add(nanoLabel);
      break;
    case BuildingNames.named200:
      ground.add(d200Label);
      break;
    default:
      break;
  }
}
export function hideLabel(building: THREE.Mesh | THREE.Group) {
  switch (building.name) {
    case BuildingNames.nameacco:
      ground.remove(accoLabel);
      break;
    case BuildingNames.namea200:
      ground.remove(a200Label);
      break;
    case BuildingNames.namec200:
      ground.remove(c200Label);
      break;
    case BuildingNames.namee200:
      ground.remove(e200Label);
      break;
    case BuildingNames.namek200:
      ground.remove(k200Label);
      break;
    case BuildingNames.namel200:
      ground.remove(l200Label);
      break;
    case BuildingNames.namem200:
      ground.remove(m200Label);
      break;
    case BuildingNames.namen200:
      ground.remove(n200Label);
      break;
    case BuildingNames.names200:
      ground.remove(s200Label);
      break;
    case BuildingNames.nameb200:
      ground.remove(b200Label);
      break;
    case BuildingNames.namemoni:
      ground.remove(moniLabel);
      break;
    case BuildingNames.namef200:
      ground.remove(f200Label);
      break;
    case BuildingNames.nameh200:
      ground.remove(h200Label);
      break;
    case BuildingNames.namenano:
      ground.remove(nanoLabel);
      break;
    case BuildingNames.named200:
      ground.remove(d200Label);
      break;
    default:
      break;
  }
}
