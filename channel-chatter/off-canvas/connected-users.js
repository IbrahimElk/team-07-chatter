import { decodeHTMlInput } from '../../encode-decode/decode.js';
export class ConnectedUsers {
    /**
     * Adds a new user to the list of connected users and updates the active users in the UI.
     * @param {PublicUser} user - The user object to be added to the list of connected users.
     * @returns {void}
     */
    static addConnectedUser(client, document, user) {
        client.addChannelActiveUser(user);
        ConnectedUsers.updateActiveUsers(document, client.getChannelActiveUsers());
    }
    /**
     * Adds a new user to the list of connected users and updates the active users in the UI.
     * @param {PublicUser} user - The user object to be added to the list of connected users.
     * @returns {void}
     */
    static setConnectedUsers(client, document, users) {
        client.setChannelActiveUsers(users);
        ConnectedUsers.updateActiveUsers(document, client.getChannelActiveUsers());
    }
    /**
     * Removes the specified user from the set of connected users and updates the list of active users.
     * @param {PublicUser} user - The user to be removed from the set of connected users.
     * @returns {void}
     */
    static removeConnectedUser(client, document, user) {
        client.removeChannelActiveUser(user);
        ConnectedUsers.updateActiveUsers(document, client.getChannelActiveUsers());
    }
    /**
     * This function updates the user interface to highlight a specific user when an active user is clicked.
     * It takes a PublicUser object as input and sets the appropriate elements in the UI with the user's information,
     * including their username, UUID, and profile picture.
     *
     * @param {PublicUser} user - The user to focus on.
     * @returns {void}
     */
    static focusUserClickHandler(user) {
        const focusUsernameElement = document.getElementById('focusUserUsername');
        const focusUUIDElement = document.getElementById('focusUUID');
        const focusProfilePictureElement = document.getElementById('focusUserProfilePicture');
        focusUsernameElement.textContent = user.name;
        focusUUIDElement.textContent = user.UUID;
        focusProfilePictureElement.src = user.profilePicture;
    }
    /**
     * Updates the UI to display the list of active users in the current channel.
     * The UI will be updated to display each user's name and profile picture, and a click event listener
     * will be added to each user's button element to focus on that user in the UI.
     * @param {Set<PublicUser>} connectedUsersSet - A Set of PublicUser objects representing the list of active users.
     */
    static updateActiveUsers(document, connectedUsersSet) {
        const connectedUsersArray = Array.from(connectedUsersSet.values()).sort();
        const listUsers = document.getElementById('listUsers');
        listUsers.innerHTML = '';
        const listActiveUsersTemplate = document.getElementById('listUsers-item');
        for (const user of connectedUsersArray) {
            const copyHTML = document.importNode(listActiveUsersTemplate.content, true);
            const activeUserUsername = copyHTML.getElementById('activeUserUsername');
            const activeUserProfilePicture = copyHTML.getElementById('activeUserProfilePicture');
            const activeUserButton = copyHTML.getElementById('activeUserButton');
            activeUserUsername.textContent = decodeHTMlInput(user.name);
            activeUserProfilePicture.src = user.profilePicture;
            activeUserButton.addEventListener('click', () => {
                ConnectedUsers.focusUserClickHandler(user);
            });
            listUsers.appendChild(copyHTML);
        }
    }
}
//# sourceMappingURL=connected-users.js.map