//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/11/17
import { Channel } from './channel.js';
/**
 * @class DirectMessageChannel @extends Channel
 */
export class DirectMessageChannel extends Channel {
    constructor(user1, user2) {
        // the initial name, and CUID of the channel is the sorted combination of the UUIDs of the
        // users in the channel.
        const uuids = [user1.getUUID(), user2.getUUID()].sort();
        const name = uuids.join('');
        super(name);
        this.users.add(user1.getUUID());
        this.users.add(user2.getUUID());
    }
    isAllowedToConnect(user) {
        return this.users.has(user.getUUID());
    }
    /**
     * Makes a JSON representation of this directmessage channel.
     * @returns A JSON represenation of this directmessage channel.
     */
    toJSON() {
        return {
            CUID: this.CUID,
            name: this.name,
            messages: [...this.messages],
            users: [...this.users],
            DATECREATED: this.DATECREATED,
        };
    }
}
//# sourceMappingURL=directmessagechannel.js.map