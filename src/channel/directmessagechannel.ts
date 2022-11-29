//Author: Barteld Van Nieuwenhove
//Date: 2022/11/17

import { channelSave } from '../database/user_database.js';
import { serverInstance } from '../database/server_database.js';
import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { Channel } from './channel.js';

export class DirectMessageChannel extends Channel {
  constructor(name: string, user1: User, user2: User, isDummy?: boolean) {
    super(name);
    let savedChannel;
    if (!isDummy) {
      savedChannel = serverInstance.getChannel(name);
    }
    if (savedChannel !== undefined) {
      // channelSave(this);
    } else {
      this.users.add(user1.getUUID());
      this.users.add(user2.getUUID());
      user1.addChannel(this);
      user2.addChannel(this);
      if (!isDummy) channelSave(this);
    }
    if (!isDummy) {
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
      messages: this.messages,
      users: this.users,
      DATECREATED: this.DATECREATED,
      channelType: 'DirectMessageChannel',
    };
  }
}
