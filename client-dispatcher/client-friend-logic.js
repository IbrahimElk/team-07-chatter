import { decodeHTMlInput } from '../encode-decode/decode.js';
export class ClientFriend {
    static errorMessages = {
        addFriendSendback: `We were not able to succesfully add your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
        removeFriendSendback: `We were not able to succesfully remove your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
        selectFriendSendback: `We were not able to succesfully select your friend because of the following problem: 'typeOfFail' \nPlease try again.`,
        getListFriendsSendback: `We were not able to successfully load the list of friends because of the following problem: 'typeOfFail' \nPlease try again.`,
    };
    /**
     * Sends an `addFriend` command with the current user's session ID and the UUID of the friend to be added
     * over a WebSocket connection to the server.
     *
     * @param client - The current user's client object.
     * @param friendUUID - The UUID of the friend to be added.
     */
    static addFriend(client, friendUUID) {
        const sessionID = client.getsessionID();
        if (sessionID) {
            const addfriend = {
                command: 'addFriend',
                payload: { sessionID: sessionID, friendUUID: friendUUID },
            };
            const ws = client.getWebSocket();
            ws.send(JSON.stringify(addfriend));
        }
    }
    /**
     * Sends a message to the server to remove a friend.
     * @param client The user's client object.
     * @param friendnameId The friend's unique ID.
     */
    static removeFriend(client, friendnameId) {
        const sessionID = client.getsessionID();
        if (sessionID) {
            const removefriend = {
                command: 'removeFriend',
                payload: { sessionID: sessionID, friendUUID: friendnameId },
            };
            const ws = client.getWebSocket();
            ws.send(JSON.stringify(removefriend));
        }
    }
    /**
     * Sends a message to the server requesting a list of friends for the given client.
     *
     * @param client The client user.
     */
    static getListFriends(client) {
        const sessionID = client.getsessionID();
        if (sessionID) {
            const list = {
                command: 'getList',
                payload: { sessionID: sessionID, string: 'getListFriends' },
            };
            const ws = client.getWebSocket();
            ws.send(JSON.stringify(list));
        }
    }
    // --------------------------------------------------------------------------------------------------------------------------
    // SENDBACK FUNCTIONS
    // --------------------------------------------------------------------------------------------------------------------------
    /**
     * Retrieves the list of friends from the server and updates the client-side HTML.
     *
     * @param {Document} document - The document object from the browser.
     * @param {ServerInterfaceTypes.getListFriendSendback['payload']} payload - The payload of the getListFriendSendback API response.
     *
     * @returns {void}
     */
    static getListFriendsSendback(document, payload) {
        if (payload.succeeded) {
            const friendList = payload.friends;
            if (friendList.length === 0) {
                return;
            }
            for (const friend of friendList) {
                const templ = document.getElementById('friendsList-friend');
                const copyHTML = document.importNode(templ.content, true);
                const usernameEl = copyHTML.querySelector('#username');
                usernameEl.textContent = decodeHTMlInput(friend.name);
                usernameEl.setAttribute('frienduuid', decodeHTMlInput(friend.UUID));
                copyHTML.getElementById('friend-profile-picture').src = friend.profilePicture;
                const friendsListEl = document.getElementById('friendslist');
                friendsListEl.appendChild(copyHTML);
            }
        }
        else {
            alert(ClientFriend.errorMessages.getListFriendsSendback.replace('typeOfFail', payload.typeOfFail));
        }
    }
    /**
     * Handles the addFriend response and updates the client-side HTML.
     *
     * @param {Document} document - The document object from the browser.
     * @param {ServerInterfaceTypes.addFriendSendback['payload']} payload - The payload of the addFriend response.
     *
     * @returns {void}
     */
    static addFriendSendback(document, payload) {
        if (payload.succeeded) {
            if (document.getElementById('friendsList-friend')) {
                const templ = document.getElementById('friendsList-friend');
                const copyHTML = document.importNode(templ.content, true);
                const usernameEl = copyHTML.querySelector('#username');
                usernameEl.textContent = decodeHTMlInput(payload.friend.name);
                usernameEl.setAttribute('frienduuid', decodeHTMlInput(payload.friend.UUID));
                copyHTML.getElementById('friend-profile-picture').src = payload.friend.profilePicture;
                document.getElementById('friendslist').appendChild(copyHTML);
                document.getElementById('addFriend').classList.remove('show');
                document.getElementById('addFriend').classList.add('hide');
                document.querySelector('.modal-backdrop').remove();
            }
        }
        else {
            alert(ClientFriend.errorMessages.addFriendSendback.replace('typeOfFail', payload.typeOfFail));
        }
    }
    /**
     * Handles the removeFriend response and updates the client-side HTML.
     *
     * @param {Window | DOMWindow} window - The window object of the browser.
     * @param {ServerInterfaceTypes.removeFriendSendback['payload']} payload - The payload of the removeFriend response.
     *
     * @returns {void}
     */
    static removeFriendSendback(window, payload) {
        if (payload.succeeded) {
            const friendsListEl = window.document.getElementById('friendslist');
            const selection = '[frienduuid="' + window.sessionStorage.getItem('selectedFriend') + '"]';
            const toDelete = friendsListEl.querySelector(selection)?.parentNode?.parentNode?.parentNode;
            friendsListEl.removeChild(toDelete);
        }
        else {
            alert(ClientFriend.errorMessages.removeFriendSendback.replace('typeOfFail', payload.typeOfFail));
        }
    }
}
//# sourceMappingURL=client-friend-logic.js.map