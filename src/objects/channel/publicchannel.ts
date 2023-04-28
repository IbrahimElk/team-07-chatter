//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import type { User } from '../user/user.js';
import { Channel } from './channel.js';

export class PublicChannel extends Channel {
  constructor(name: string) {
    super(name);
  }

  /**
   * Adds specified user to this channel.
   * @param user The user to be added to this Public Channel.
   */
  addUser(user: User): void {
    this.users.add(user.getUUID());
  }

  /**
   * Removes specified user from this channel.
   * @param user The user to be removed from this Public Channel.
   */
  removeUser(user: User): void {
    this.users.delete(user.getUUID());
  }

  override isAllowedToConnect(user: User): boolean {
    return true;
  }

  /**
   * Makes a JSON representation of this public channel.
   * @returns A JSON represenation of this public channel.
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
