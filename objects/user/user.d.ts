import type { Channel } from '../channel/channel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type { PublicChannel } from '../channel/publicchannel.js';
import { Timetable } from '../timeTable/timeTable.js';
import type { KULTimetable } from '../timeTable/fakeTimeTable.js';
import type { DirectMessageChannel } from '../channel/directmessagechannel.js';
import type { PublicUser } from '../../front-end/proto/client-types.js';
import type { UserJSONSchema } from '../../database/user_database.js';
export declare class User {
    private UUID;
    private name;
    private password;
    private friendChannels;
    private publicChannels;
    private friends;
    private connectedChannels;
    private webSocket;
    private sessionID;
    private ngramMap;
    private trustLevel;
    private timeTable;
    private profilePicture;
    private ngramBuffer;
    private verificationSucceeded;
    constructor(name: string, password: string);
    /**
     * Retrieves the UUID of this user.
     * @returns The UUID associated with this user
     */
    getUUID(): string;
    /**
     * Retrieves the name of this user.
     * @returns A string representing this user name.
     */
    getName(): string;
    /**
     * Retrieves the password of this user.
     * @returns The password of this user.
     */
    getPassword(): string;
    /**
     * Retrieves all friends of this user.
     * @returns A set of users representing all friends this user has.
     */
    getFriends(): Set<string>;
    /**
     *
     */
    getPublicChannels(): Set<string>;
    /**
     *
     */
    getFriendChannels(): Set<string>;
    getPublicUser(): PublicUser;
    /**
     * Retreives channel this user is currently connected to.
     * @returns The channel this user is currently connected to, if none it returns the default channel.
     */
    getConnectedChannels(): Set<string>;
    /**
     * Retrieves the server to client websocket.
     * @returns The websocket for communicating from server to client if this user is connected to the server, undefined otherwise.
     */
    getWebSocket(): Set<IWebSocket>;
    getSessionID(): string | undefined;
    getProfilePicture(): string;
    getVerification(): boolean;
    getLastTrustLevel(): number;
    /**
     * Checks whether a user is friends with this user.
     * @param friend The user being checked whether they are this user's friend.
     * @returns True if the given user is friends with this user, false otherwise.
     */
    isFriend(friend: User): boolean;
    /**
     * Checks whether a channel is saved to this user.
     * @param channel The channel to be checked wheter it's saved to this user
     * @returns a boolean indicating whether the channel has been saved to this user or not.
     */
    isPartOfFriendChannel(channel: DirectMessageChannel): boolean;
    /**
     * Checks whether a channel is saved to this user.
     * @param channel The channel to be checked wheter it's saved to this user
     * @returns a boolean indicating whether the channel has been saved to this user or not.
     */
    isPartOfPublicChannel(channel: PublicChannel): boolean;
    isConnectedToChannel(channel: Channel): boolean;
    /**
     * Overrides this user's current name with a new one.
     * @param newName A string representing the new name.
     */
    setName(newName: string): void;
    /**
     * Overrides this user's current password with a new one.
     * @param newPassword A string representing the new password.
     */
    setPassword(newPassword: string): void;
    setWebsocket(websocket: IWebSocket): void;
    removeWebSocket(websocket: IWebSocket): void;
    setSessionID(sessionId: string): void;
    setProfilePicture(profileLink: string): void;
    /**
     * Adds a user to this user's set of friends.
     * @param friend The user being added to this user's friends.
     */
    addFriend(friend: User, friendChannel: DirectMessageChannel): void;
    /**
     * Removes a user from this user's set of friends.
     * @param friend The user being removed from this user's friends.
     */
    removeFriend(friend: User): void;
    getFriendChannelCUID(friend: User): string | undefined;
    /**
     * Adds a channel to this user's saved channels
     * @param channel The channel to be added to this user.
     */
    addPublicChannel(channelId: string): void;
    /**
     * Removes a channel from this user's saved channels
     * @param channel The channel to be removed from this user.
     */
    removePublicChannel(channelId: string): void;
    /**
     * Sets the channel this user is currently connected to. If this user has never connected to this channel it gets saved to this users saved channels.
     * @param channel The channel to connect this user to.
     */
    connectToChannel(channel: Channel, ws: IWebSocket): void;
    /**
     * Checks whether this user has typed the text to set up the keystroke fingerprint analysis
     * @returns Whether this user has typed the text or not
     */
    setVerification(verification: boolean): void;
    disconnectFromChannel(channel: Channel, ws?: IWebSocket): void;
    getChannelWebSockets(channel: Channel): Set<IWebSocket>;
    setLastTrustLevel(trust: number): void;
    getNgrams(): Map<string, number>;
    /**
     *This function goes over each ngram in the given map of ngrams. If the corresponding keystroke
      isn't used yet (== not present in the keystrokes of this user), then a new field will be added in
      this users ngrams with that keystroke and corresponding timing. If the keystroke is already typed,
      then the mean will be updated in changeStateUser.
     * @param NewNgram is a map with all keystrokes and their corresponding timings, that have just been typed.
     */
    setNgrams(NewNgram: Map<string, number>): void;
    /**
     * this function shouldn't be called. It is used for testing purposes
     */
    getBuffer(): Map<string, number>;
    /**
     * Adds the given ngrams to the memory, but buffers them first, so messages with a small amount of keystrokes aren't added yet. The new keystrokes are loaded
     *  into a buffer first. If this buffer excedes a certain threshold, this buffer will be loaded into the memory of the user.
     * @param NewNgram
     */
    bufferNgrams(newNgram: Map<string, number>): void;
    /**
     * M_k−1 + (x_k − M_k−1)/k
     * @param NewValue
     * @param OldValue
     * @param Kvalue
     * @returns
     */
    private calculateNewMean;
    /**
     * This function calculates a new mean for this keystroke timing. It uses exponential smoothing to represent evolution in typing timings.
     * @param newElement Is the keystroke that just has been typed, so the ngram mean for this string must
     *  be updated with the number in newElement
     */
    private ChangeStateUser;
    /**
     * Retreives the timetable of this user.
     * @returns The timeTable of this user if it exists, undefined otherwise.
     */
    getTimeTable(): Timetable | undefined;
    /**
     * Updates the user's Timetable based on the provided KULTimetable object.
     * @param timetable KULTimetable representation of timetable to be added to the user.
     */
    updateTimeTable(timetable: KULTimetable): void;
    /**
     * Helps parse the JSON representation of a user back to a user instance.
     * @param json JSON object representing the User
     * @returns User instance based on the JSON representation.
     */
    static fromJSON(json: UserJSONSchema): User;
    /**
     * Makes a JSON representation of this user.
     * @returns A JSON represenation of this user.
     */
    toJSON(): {
        UUID: string;
        name: string;
        password: string;
        profilePicture: string;
        publicChannels: string[];
        friendChannels: string[];
        friends: string[];
        ngrams: [string, number][];
        verificationSucceeded: boolean;
    };
}
//# sourceMappingURL=user.d.ts.map