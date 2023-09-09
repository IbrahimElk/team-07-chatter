import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { DOMWindow } from 'jsdom';
import type { ClientUser } from './client-user.js';
export declare class ClientFriend {
    private static errorMessages;
    /**
     * Sends an `addFriend` command with the current user's session ID and the UUID of the friend to be added
     * over a WebSocket connection to the server.
     *
     * @param client - The current user's client object.
     * @param friendUUID - The UUID of the friend to be added.
     */
    static addFriend(client: ClientUser, friendUUID: string): void;
    /**
     * Sends a message to the server to remove a friend.
     * @param client The user's client object.
     * @param friendnameId The friend's unique ID.
     */
    static removeFriend(client: ClientUser, friendnameId: string): void;
    /**
     * Sends a message to the server requesting a list of friends for the given client.
     *
     * @param client The client user.
     */
    static getListFriends(client: ClientUser): void;
    /**
     * Retrieves the list of friends from the server and updates the client-side HTML.
     *
     * @param {Document} document - The document object from the browser.
     * @param {ServerInterfaceTypes.getListFriendSendback['payload']} payload - The payload of the getListFriendSendback API response.
     *
     * @returns {void}
     */
    static getListFriendsSendback(document: Document, payload: ServerInterfaceTypes.getListFriendSendback['payload']): void;
    /**
     * Handles the addFriend response and updates the client-side HTML.
     *
     * @param {Document} document - The document object from the browser.
     * @param {ServerInterfaceTypes.addFriendSendback['payload']} payload - The payload of the addFriend response.
     *
     * @returns {void}
     */
    static addFriendSendback(document: Document, payload: ServerInterfaceTypes.addFriendSendback['payload']): void;
    /**
     * Handles the removeFriend response and updates the client-side HTML.
     *
     * @param {Window | DOMWindow} window - The window object of the browser.
     * @param {ServerInterfaceTypes.removeFriendSendback['payload']} payload - The payload of the removeFriend response.
     *
     * @returns {void}
     */
    static removeFriendSendback(window: Window | DOMWindow, payload: ServerInterfaceTypes.removeFriendSendback['payload']): void;
}
//# sourceMappingURL=client-friend-logic.d.ts.map