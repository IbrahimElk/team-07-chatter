// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import * as KEY from '../keystroke-fingerprinting/imposter.js';
import { decodeHTMlInput } from '../encode-decode/decode.js';
/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export class ClientUser {
    websocket;
    timeStamps = new Array();
    activeConnections = new Map();
    sessionStorage;
    constructor(ws, sessionStorage) {
        this.websocket = ws;
        this.sessionStorage = sessionStorage;
    }
    // -------- SETTERS ---------------
    /**
     * Sets the username of the client user and stores it in the session storage.
     * @param {string} username - The username to set.
     * @returns {void}
     */
    setUsername(username) {
        this.sessionStorage.setItem('username', decodeHTMlInput(username));
    }
    /**
     * Sets the UUID of the current user in the session storage.
     * @param {string} usernameId - The UUID to set for the current user.
     * @returns void
     */
    setUUID(usernameId) {
        this.sessionStorage.setItem('usernameId', decodeHTMlInput(usernameId));
    }
    /**
     * Sets the session ID in the client's session storage.
     * @param {string} sessionID The session ID to set.
     */
    setsessionID(sessionID) {
        this.sessionStorage.setItem('sessionID', sessionID);
    }
    /**
     * Set profile picture of the user in session storage
     * @param {string} profileLink - The link to the user's profile picture
     */
    setProfilePicture(profileLink) {
        this.sessionStorage.setItem('profile', profileLink);
    }
    /**
     * Sets the current friend UUID in the session storage.
     *
     * @param {string} friendNameUuid - The UUID of the current friend.
     * @returns {void}
     */
    setCurrentFriend(friendNameUuid) {
        this.sessionStorage.setItem('friendUUID', decodeHTMlInput(friendNameUuid));
    }
    // --------- GETTERS  ------------
    /**
     * Gets the UUID of the current user.
     *
     * @returns The UUID of the current user or null if not set.
     */
    getUUID() {
        return this.sessionStorage.getItem('usernameId');
    }
    /**
     * Returns the stored username of the client user from the session storage.
     * @returns The username of the client user, or null if it's not found.
     */
    getUsername() {
        return this.sessionStorage.getItem('username');
    }
    /**
     * Returns the session ID of the user if it exists in the session storage.
     * If the session storage is undefined, returns a fake session ID.
     * @returns The session ID of the user or null if it does not exist in the session storage.
     */
    getsessionID() {
        if (typeof this.sessionStorage === 'undefined')
            return 'fakeSessionID';
        else
            return this.sessionStorage.getItem('sessionID');
    }
    /**
     * Get the current friend UUID from the session storage.
     * @returns The current friend UUID or null if it is not set.
     */
    getCurrentFriend() {
        return this.sessionStorage.getItem('friendUUID');
    }
    /**
     * Retrieves the profile link of the user from the session storage.
     * @returns {string | null} The profile link if it exists, otherwise null.
     */
    getProfileLink() {
        return this.sessionStorage.getItem('profile');
    }
    // --------- CHANNELS ------------
    /**
     * Remove a PublicUser from the activeConnections Map.
     * @param connection PublicUser to be removed from activeConnections Map.
     */
    removeChannelActiveUser(connection) {
        this.activeConnections.delete(connection.UUID);
    }
    /**
     * Add a connection to the active connections set for this current channel.
     * @param {PublicUser} connection - The connection to add to the active connections set.
     * @returns {void}
     */
    addChannelActiveUser(connection) {
        this.activeConnections.set(connection.UUID, connection);
    }
    /**
     * Add a Set of connections to the active connections set for this current channel.
     * @param {Set<PublicUser>} connections - The Set of connections to add to the active connections set.
     */
    setChannelActiveUsers(connections) {
        this.activeConnections.clear();
        for (const connection of connections) {
            this.addChannelActiveUser(connection);
        }
    }
    /**
     * get the Set of active connections for this current channel.
     * @returns
     */
    getChannelActiveUsers() {
        return new Set(this.activeConnections.values());
    }
    /**
     *  Store the given timetable in sessionStorage. Replaces the previous timetable stored.
     * @param {TimeTable[]} Rooms - timetable object
     */
    updateTimetable(Rooms) {
        this.sessionStorage.setItem('TimeTables', JSON.stringify(Rooms));
    }
    /**
     * get the current class romm that is going on at this time.
     * @returns
     */
    getCurrentClassRoom() {
        const currentTime = Date.now();
        const TimeTables = this.sessionStorage.getItem('TimeTables');
        if (TimeTables !== null && TimeTables !== undefined) {
            const classRooms = JSON.parse(TimeTables); //FIXME: ZOD safeparse
            for (const classRoom of classRooms) {
                // if the class ends after the current time
                if (classRoom.endTime > currentTime) {
                    return classRoom;
                }
            }
            return undefined;
        }
        return undefined;
    }
    // --------- KEYSTROKES ------------
    /**
     * Add timestamp of keypress.
     * @param letter
     * @param date
     */
    AddTimeStamp(letter, date) {
        this.timeStamps.push([letter, date]);
    }
    /**
     * get the delta of all keystrokes registred till now.
     * @returns
     */
    GetDeltaCalulations() {
        const timingMap = KEY.calculateDelta(this.timeStamps, 2);
        return timingMap;
    }
    /**
     * remove the current timestamps stored.
     */
    removeCurrentTimeStamps() {
        this.timeStamps = [];
    }
    /**
     * get the current webscoket used to connect to the server.
     * @returns
     */
    getWebSocket() {
        return this.websocket;
    }
}
//# sourceMappingURL=client-user.js.map