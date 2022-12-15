//Author: Barteld Van Nieuwenhove
//Date: 2022/11/17

import { serverInstance } from '../chat-server/chat-server-script.js';
import type { User } from '../user/user.js';
import { Channel } from './channel.js';

export class DirectMessageChannel extends Channel {
  /**
   * @constructs DirectMessageChannel
   * @param name The name of this directmessage channel.
   * @param user1 The first user part of this directmessage channel.
   * @param user2 The second user part of this directmessage channel.
   * @param isDummy Boolean passed for constucting dummy channel, assumed to not exist and which won't be saved anywhere.
   */
  constructor(name: string, user1: User, user2: User, isDummy?: boolean) {
    super(name, isDummy);
    if (!isDummy) {
      this.users.add(user1.getUUID());
      this.users.add(user2.getUUID());
      user1.addChannel(this);
      user2.addChannel(this);
      serverInstance.systemCacheChannel(this);
    }
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
      channelType: 'DirectMessageChannel',
    };
  }
}
