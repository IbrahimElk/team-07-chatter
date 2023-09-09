// Author: Maité Desmedt, Barteld Van Nieuwenhove
// Date: 5/5/2023
import * as THREE from 'three';
import { client } from '../../main.js';
import { BuildingNames } from './dataToImport.js';
import '../../client-dispatcher/client-user.js';
// import { getClass } from './timetable.js';
export function showPopup(building) {
    let buildingName;
    if (building instanceof THREE.Mesh && building.parent instanceof THREE.Group) {
        buildingName = building.parent.name;
    }
    else {
        buildingName = building.name;
    }
    document.querySelector('.text-black').textContent = '';
    if (buildingName === BuildingNames.nameacco) {
        document.querySelector('.text-black').append('This is building ' + buildingName + '. If you click on this building you can see a list of your friends.');
    }
    else if (buildingName === client.getCurrentClassRoom()?.building) {
        document.querySelector('.text-black').append('This is building ' +
            buildingName +
            ', you have a lesson going on here at the moment. \n' +
            ' If you click on this building, you will open the corresponding chat window.');
    }
    else
        document.querySelector('.text-black').append('This is building ' + buildingName + ', there are no lessons given in this building at the moment.');
    //(document.querySelector(".popup") as HTMLElement).style.display = 'block';
}
export function hidePopup() {
    document.querySelector('.text-black').textContent = '';
}
//# sourceMappingURL=popup.js.map