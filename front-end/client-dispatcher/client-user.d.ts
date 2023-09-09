import type { PublicUser } from '../proto/client-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
export interface TimeTable {
    description: string;
    startTime: number;
    endTime: number;
    building: string;
}
/**
 * A client side class that serves to store information about the user.
 * i.e. To store keystrokes of the user.
 */
export declare class ClientUser {
    private websocket;
    private timeStamps;
    private activeConnections;
    private sessionStorage;
    constructor(ws: IWebSocket | WebSocket, sessionStorage: Storage);
    /**
     * Sets the username of the client user and stores it in the session storage.
     * @param {string} username - The username to set.
     * @returns {void}
     */
    setUsername(username: string): void;
    /**
     * Sets the UUID of the current user in the session storage.
     * @param {string} usernameId - The UUID to set for the current user.
     * @returns void
     */
    setUUID(usernameId: string): void;
    /**
     * Sets the session ID in the client's session storage.
     * @param {string} sessionID The session ID to set.
     */
    setsessionID(sessionID: string): void;
    /**
     * Set profile picture of the user in session storage
     * @param {string} profileLink - The link to the user's profile picture
     */
    setProfilePicture(profileLink: string): void;
    /**
     * Sets the current friend UUID in the session storage.
     *
     * @param {string} friendNameUuid - The UUID of the current friend.
     * @returns {void}
     */
    setCurrentFriend(friendNameUuid: string): void;
    /**
     * Gets the UUID of the current user.
     *
     * @returns The UUID of the current user or null if not set.
     */
    getUUID(): string | null;
    /**
     * Returns the stored username of the client user from the session storage.
     * @returns The username of the client user, or null if it's not found.
     */
    getUsername(): string | null;
    /**
     * Returns the session ID of the user if it exists in the session storage.
     * If the session storage is undefined, returns a fake session ID.
     * @returns The session ID of the user or null if it does not exist in the session storage.
     */
    getsessionID(): string | null;
    /**
     * Get the current friend UUID from the session storage.
     * @returns The current friend UUID or null if it is not set.
     */
    getCurrentFriend(): string | null;
    /**
     * Retrieves the profile link of the user from the session storage.
     * @returns {string | null} The profile link if it exists, otherwise null.
     */
    getProfileLink(): string | null;
    /**
     * Remove a PublicUser from the activeConnections Map.
     * @param connection PublicUser to be removed from activeConnections Map.
     */
    removeChannelActiveUser(connection: PublicUser): void;
    /**
     * Add a connection to the active connections set for this current channel.
     * @param {PublicUser} connection - The connection to add to the active connections set.
     * @returns {void}
     */
    addChannelActiveUser(connection: PublicUser): void;
    /**
     * Add a Set of connections to the active connections set for this current channel.
     * @param {Set<PublicUser>} connections - The Set of connections to add to the active connections set.
     */
    setChannelActiveUsers(connections: Set<PublicUser>): void;
    /**
     * get the Set of active connections for this current channel.
     * @returns
     */
    getChannelActiveUsers(): Set<PublicUser>;
    /**
     *  Store the given timetable in sessionStorage. Replaces the previous timetable stored.
     * @param {TimeTable[]} Rooms - timetable object
     */
    updateTimetable(Rooms: TimeTable[]): void;
    /**
     * get the current class romm that is going on at this time.
     * @returns
     */
    getCurrentClassRoom(): TimeTable | undefined;
    /**
     * Add timestamp of keypress.
     * @param letter
     * @param date
     */
    AddTimeStamp(letter: string, date: number): void;
    /**
     * get the delta of all keystrokes registred till now.
     * @returns
     */
    GetDeltaCalulations(): Map<string, number>;
    /**
     * remove the current timestamps stored.
     */
    removeCurrentTimeStamps(): void;
    /**
     * get the current webscoket used to connect to the server.
     * @returns
     */
    getWebSocket(): IWebSocket | WebSocket;
}
//# sourceMappingURL=client-user.d.ts.map