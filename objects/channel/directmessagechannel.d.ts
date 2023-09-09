import type { User } from '../user/user.js';
import { Channel } from './channel.js';
/**
 * @class DirectMessageChannel @extends Channel
 */
export declare class DirectMessageChannel extends Channel {
    constructor(user1: User, user2: User);
    isAllowedToConnect(user: User): boolean;
    /**
     * Makes a JSON representation of this directmessage channel.
     * @returns A JSON represenation of this directmessage channel.
     */
    toJSON(): {
        CUID: string;
        name: string;
        messages: import("../message/message.js").Message[];
        users: string[];
        DATECREATED: number;
    };
}
//# sourceMappingURL=directmessagechannel.d.ts.map