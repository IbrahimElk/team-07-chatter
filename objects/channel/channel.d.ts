import type { Message } from '../message/message.js';
import type { User } from '../user/user.js';
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
export declare abstract class Channel {
    protected CUID: string;
    protected name: string;
    protected messages: Message[];
    protected users: Set<string>;
    protected connected: Set<string>;
    protected DATECREATED: number;
    /**
     * @constructs @abstract Channel
     * @param name string name of the channel.
     * @param isDummy boolean passed for constucting dummy channel, assumed to not exist and which won't be saved anywhere.
     */
    constructor(name: string);
    setDateCreated(DATECREATED: number): void;
    /**
     * Retrieves the CUID of this channel.
     * @returns The CUID associated with this channel.
     */
    getCUID(): string;
    /**
     * Overrides this channel's current name with a new one.
     * @param newName A string representing the new name.
     */
    setName(newName: string): void;
    /**
     * Gets this channel's name.
     * @returns This channel's name.
     */
    getName(): string;
    /**
     * Retrieves all users that are part of this channel.
     * @returns A set of all users part of this channel.
     */
    getUsers(): Set<string>;
    /**
     * Retrieves all users currently connected to this channel.
     * @returns A set of all users connected to this channel.
     */
    getConnectedUsers(): Set<string>;
    /**
     * Gets either all or a specified number of messages, starting from the last sent message, from this channel.
     * @param numberOfMessages Number of messages you wish to get.
     * @param reverse Boolean whether the order of messages should start from back or from front
     * @returns Returns either a specific number of messsages or all messages of a channel.
     */
    getMessages(numberOfMessages?: number, reverse?: boolean): Array<Message>;
    /**
     * Gets the last message sent in this channel.
     * @returns The last message in a channel if not empty, undefined otherwise.
     */
    getLastMessage(): Message | undefined;
    /**
     * Adds a message to this channel.
     * @param message Message to be added to the channel.
     */
    addMessage(message: Message): void;
    /**
     * Retrieves the time of when this channel was created.
     * @returns The time since epoch (January 1st 1970) in miliseconds that this channel has been created.
     */
    getDateCreated(): number;
    /**
     * Checks whether a user is a member of this channel.
     * @param user User to be checked whether they're a member of this channel.
     * @returns True if the user is a member of this channel.
     */
    isMemberUser(user: User): boolean;
    /**
     * Checks whether a user is connected to this channel.
     * @param user User to be checked whether they're connected.
     * @returns True if the user is currently connected to this channel, false otherwise.
     */
    isConnectedUser(user: User): boolean;
    abstract isAllowedToConnect(user: User): boolean;
    /**
     * Adds a user to the list of connected users of this channel.
     * @param user A user to be connected to this channel.
     */
    systemAddConnected(user: User): void;
    /**
     * Removes a user from the list of connected users of this channel.
     * @param user A user to be disconnected from this channel.
     */
    systemRemoveConnected(user: User): void;
    /**
     * Removes a user from the list of connected users of this channel.
     * @param user A user to be disconnected from this channel.
     */
    systemRemoveUser(user: User): void;
}
//# sourceMappingURL=channel.d.ts.map