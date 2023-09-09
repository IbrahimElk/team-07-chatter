import type { User } from '../user/user.js';
import { Channel } from './channel.js';
export declare class PublicChannel extends Channel {
    constructor(name: string);
    /**
     * Adds specified user to this channel.
     * @param user The user to be added to this Public Channel.
     */
    addUser(user: User): void;
    /**
     * Removes specified user from this channel.
     * @param user The user to be removed from this Public Channel.
     */
    removeUser(user: User): void;
    isAllowedToConnect(user: User): boolean;
    /**
     * Makes a JSON representation of this public channel.
     * @returns A JSON represenation of this public channel.
     */
    toJSON(): {
        CUID: string;
        name: string;
        messages: import("../message/message.js").Message[];
        users: string[];
        DATECREATED: number;
    };
}
//# sourceMappingURL=publicchannel.d.ts.map