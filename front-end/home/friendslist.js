import { ClientFriend } from '../client-dispatcher/client-friend-logic.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';
import { client } from '../main.js';
import { startAnimation } from './threejs/layout.js';
/**
 * Initialize all event listeners needed when pressing the acco building.
 */
export function openFriendsList() {
    const myOffcanvas = document.getElementById('myOffcanvas');
    const addFriendButton = document.getElementById('addFriendBtn');
    const closeButton = document.getElementById('friend-close-button');
    const blockFriendButton = document.getElementById('blockFriendBtn');
    // OPEN CANVAS
    myOffcanvas?.classList.toggle('show');
    // ADD FRIEND KNOP
    addFriendButton.addEventListener('click', function () {
        addFriend();
    });
    // CLOSE CANVAS KNOP
    closeButton.addEventListener('click', function () {
        myOffcanvas?.classList.remove('show'); // remove the 'show' class to hide the offcanvas
        const friendsListEl = document.getElementById('friendslist');
        while (friendsListEl.firstChild) {
            friendsListEl.removeChild(friendsListEl.firstChild);
        }
        startAnimation();
    });
    // LIST FRIENDS
    ClientFriend.getListFriends(client);
    // TODO: REMOVE FRIEND BUTTON
    blockFriendButton.addEventListener('click', function () {
        ClientFriend.removeFriend(client, encodeHTMlInput(sessionStorage.getItem('selectedFriend')));
    });
}
function addFriend() {
    const usernameID = document.getElementById('newFriendUsername').value;
    ClientFriend.addFriend(client, encodeHTMlInput(usernameID));
}
//# sourceMappingURL=friendslist.js.map