// Author: Maité Desmedt, Barteld Van Nieuwenhove
// Date: 5/5/2023
import * as THREE from 'three';
import { BuildingNames } from './dataToImport.js';
import { openFriendsList } from '../friendslist.js';
import { client } from '../../main.js';
import '../../client-dispatcher/client-user.js';
import { stopAnimation } from './layout.js';
// import { hideLabel } from './labels.js';
// import { hidePopup } from './popup.js';
export function redirect(building) {
    const buildingName = building instanceof THREE.Mesh && building.parent instanceof THREE.Group ? building.parent.name : building.name;
    const classRoom = client.getCurrentClassRoom();
    if (buildingName === BuildingNames.nameacco) {
        stopAnimation();
        openFriendsList();
    }
    if (classRoom && buildingName === classRoom.building) {
        stopAnimation();
        window.location.href = '../channel-chatter/chat-window.html';
        return;
    }
}
//# sourceMappingURL=redirect.js.map