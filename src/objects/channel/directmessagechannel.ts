//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/11/17

import type { User } from '../user/user.js';
import { Channel } from './channel.js';

/**
 * @class DirectMessageChannel @extends Channel
 */
export class DirectMessageChannel extends Channel {
  getDatabaseLocation(): string {
    return './assets/database/direct-message-channels/';
  }
  constructor(name: string, user1Id: string, user2Id: string) {
    super(name);
    this.users.add(user1Id);
    this.users.add(user2Id);
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
