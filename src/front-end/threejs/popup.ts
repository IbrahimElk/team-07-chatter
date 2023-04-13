// @ts-ignore
import * as THREE from 'three';
import { getClass } from './timetable.js';

export function showPopup(building: THREE.Object3D<THREE.Event>) {
  let buildingName;
  if (building instanceof THREE.Mesh && building.parent instanceof THREE.Group) {
    buildingName = building.parent.name;
  } else {
    buildingName = building.name;
  }

  (document.querySelector('.text') as HTMLElement).textContent = '';
  if (buildingName === getClass()?.building) {
    (document.querySelector('.text') as HTMLElement).append(
      'This is building ' + buildingName + ' you have a lesson going on here at the moment.'
    );
  } else
    (document.querySelector('.text') as HTMLElement).append(
      'This is building ' + buildingName + ' and there are no lessons given in this building at the moment'
    );
  //(document.querySelector(".popup") as HTMLElement).style.display = 'block';
}

export function hidePopup() {
  (document.querySelector('.text') as HTMLElement).textContent = '';
}
