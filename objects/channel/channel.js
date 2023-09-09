//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31
/**
 * @abstract @class Channel
 *
 * @protected {CUID} channel unique identifier.
 * @protected {name} string name of the channel.
 * @protected {messages} array of message objects.
 * @protected {users} set of all UUID of the users that are part of the channel.
 * @protected {connected} set of all UUID of the users currently watching the channel.
 * @protected {DATCREATED} number of the time in miliseconds since epoch the channel was created.
 */
export class Channel {
    CUID;
    name;
    messages;
    users;
    connected;
    DATECREATED;
    /**
     * @constructs @abstract Channel
     * @param name string name of the channel.
     * @param isDummy boolean passed for constucting dummy channel, assumed to not exist and which won't be saved anywhere.
     */
    constructor(name) {
        this.CUID = '#' + name;
        this.name = name;
        this.messages = new Array();
        this.users = new Set();
        this.connected = new Set();
        this.DATECREATED = Date.now();
    }
    setDateCreated(DATECREATED) {
        this.DATECREATED = DATECREATED;
    }
    /**
     * Retrieves the CUID of this channel.
     * @returns The CUID associated with this channel.
     */
    getCUID() {
        return this.CUID;
    }
    /**
     * Overrides this channel's current name with a new one.
     * @param newName A string representing the new name.
     */
    setName(newName) {
        this.name = newName;
    }
    /**
     * Gets this channel's name.
     * @returns This channel's name.
     */
    getName() {
        return this.name;
    }
    /**
     * Retrieves all users that are part of this channel.
     * @returns A set of all users part of this channel.
     */
    getUsers() {
        return new Set(this.users);
    }
    /**
     * Retrieves all users currently connected to this channel.
     * @returns A set of all users connected to this channel.
     */
    getConnectedUsers() {
        return new Set(this.connected);
    }
    /**
     * Gets either all or a specified number of messages, starting from the last sent message, from this channel.
     * @param numberOfMessages Number of messages you wish to get.
     * @param reverse Boolean whether the order of messages should start from back or from front
     * @returns Returns either a specific number of messsages or all messages of a channel.
     */
    getMessages(numberOfMessages, reverse = false) {
        if (numberOfMessages !== undefined) {
            if (reverse)
                return this.messages.slice(-numberOfMessages);
            else
                return this.messages.slice(0, numberOfMessages);
        }
        if (reverse)
            return this.messages.reverse();
        else
            return this.messages;
    }
    /**
     * Gets the last message sent in this channel.
     * @returns The last message in a channel if not empty, undefined otherwise.
     */
    getLastMessage() {
        return this.messages[this.messages.length - 1];
    }
    /**
     * Adds a message to this channel.
     * @param message Message to be added to the channel.
     */
    addMessage(message) {
        this.messages.push(message);
    }
    /**
     * Retrieves the time of when this channel was created.
     * @returns The time since epoch (January 1st 1970) in miliseconds that this channel has been created.
     */
    getDateCreated() {
        return this.DATECREATED;
    }
    /**
     * Checks whether a user is a member of this channel.
     * @param user User to be checked whether they're a member of this channel.
     * @returns True if the user is a member of this channel.
     */
    isMemberUser(user) {
        for (const memberUuid of this.users) {
            if (memberUuid === user.getUUID()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks whether a user is connected to this channel.
     * @param user User to be checked whether they're connected.
     * @returns True if the user is currently connected to this channel, false otherwise.
     */
    isConnectedUser(user) {
        for (const memberUuid of this.connected) {
            if (memberUuid === user.getUUID()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Adds a user to the list of connected users of this channel.
     * @param user A user to be connected to this channel.
     */
    systemAddConnected(user) {
        if (this.isAllowedToConnect(user)) {
            this.users.add(user.getUUID());
            this.connected.add(user.getUUID());
        }
    }
    /**
     * Removes a user from the list of connected users of this channel.
     * @param user A user to be disconnected from this channel.
     */
    systemRemoveConnected(user) {
        for (const connectedUserUuid of this.connected) {
            if (connectedUserUuid === user.getUUID()) {
                this.connected.delete(connectedUserUuid);
                break;
            }
        }
        //fire disconnection event
    }
    /**
     * Removes a user from the list of connected users of this channel.
     * @param user A user to be disconnected from this channel.
     */
    systemRemoveUser(user) {
        for (const aUserUuid of this.users) {
            if (aUserUuid === user.getUUID()) {
                this.users.delete(aUserUuid);
                break;
            }
        }
    }
}
//# sourceMappingURL=channel.js.map