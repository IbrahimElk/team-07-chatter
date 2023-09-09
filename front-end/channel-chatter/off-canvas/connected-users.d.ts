import type { PublicUser } from '../../proto/client-types.js';
import type { ClientUser } from '../../client-dispatcher/client-user.js';
export declare class ConnectedUsers {
    /**
     * Adds a new user to the list of connected users and updates the active users in the UI.
     * @param {PublicUser} user - The user object to be added to the list of connected users.
     * @returns {void}
     */
    static addConnectedUser(client: ClientUser, document: Document, user: PublicUser): void;
    /**
     * Adds a new user to the list of connected users and updates the active users in the UI.
     * @param {PublicUser} user - The user object to be added to the list of connected users.
     * @returns {void}
     */
    static setConnectedUsers(client: ClientUser, document: Document, users: Set<PublicUser>): void;
    /**
     * Removes the specified user from the set of connected users and updates the list of active users.
     * @param {PublicUser} user - The user to be removed from the set of connected users.
     * @returns {void}
     */
    static removeConnectedUser(client: ClientUser, document: Document, user: PublicUser): void;
    /**
     * This function updates the user interface to highlight a specific user when an active user is clicked.
     * It takes a PublicUser object as input and sets the appropriate elements in the UI with the user's information,
     * including their username, UUID, and profile picture.
     *
     * @param {PublicUser} user - The user to focus on.
     * @returns {void}
     */
    static focusUserClickHandler(user: PublicUser): void;
    /**
     * Updates the UI to display the list of active users in the current channel.
     * The UI will be updated to display each user's name and profile picture, and a click event listener
     * will be added to each user's button element to focus on that user in the UI.
     * @param {Set<PublicUser>} connectedUsersSet - A Set of PublicUser objects representing the list of active users.
     */
    static updateActiveUsers(document: Document, connectedUsersSet: Set<PublicUser>): void;
}
//# sourceMappingURL=connected-users.d.ts.map