//Author: Barteld Van Nieuwenhove, El Kaddouri Ibrahim
//Date: 2022/10/31

import type { User } from '../user/user.js';
import { Channel } from './channel.js';

export class PublicChannel extends Channel {
  getDatabaseLocation(): string {
    return './assets/database/public-channels/';
  }
  constructor(name: string, CUID: string) {
    super(name, CUID);
  }

  /**
   * Adds specified user to this channel.
   * @param user The user to be added to this Public Channel.
   */
  addUser(userId: string): void {
    this.users.add(userId);
  }

  /**
   * Removes specified user from this channel.
   * @param user The user to be removed from this Public Channel.
   */
  removeUser(user: User): void {
    this.users.delete(user.getUUID());
  }

  /**
   * Connects a user to the channel and adds them to the members if needed.
   * @param user
   */
  override systemAddConnected(user: User): void {
    this.connected.add(user.getUUID());
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
