//Author: Barteld Van Nieuwenhove
//Date: 2022/11/17

import type { User } from '../user/user.js';
import { Channel } from './channel.js';

export class DirectMessageChannel extends Channel {
  constructor(name: string, user1: User, user2: User) {
    super(name);
    this.users.add(user1.getUUID());
    this.users.add(user2.getUUID());
    user1.addChannel(this);
    user2.addChannel(this);
  }

  /**
   * Makes a JSON representation of this directmessage channel.
   * @returns A JSON represenation of this directmessage channel.
   */
  toJSON() {
    return {
      CUID: this.getCUID(),
      name: this.getName(),
      messages: this.getMessages(),
      users: this.getUsers(),
      DATECREATED: this.getDateCreated(),
      channelType: 'DirectMessageChannel',
    };
  }
}
