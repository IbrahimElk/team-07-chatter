//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import { aaainstance } from '../aadatabase/aserver_database.js';
import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { Channel } from './channel.js';

export class PrivateChannel extends Channel {
  private owner: UUID;

  constructor(name: string, owner: User) {
    super(name);
    this.owner = owner.getUUID();
    this.addUser(owner);
  }

  /**
   * Adds specified user to this Private Channel.
   * @param user The user to be added.
   */
  addUser(user: User): void {
    if (this.users.has(user.getUUID())) return;
    this.users.add(user.getUUID());
    if (!user.getChannels().has(this)) {
      user.addChannel(this);
    }
  }

  /**
   * Removes specified user from this Private Channel.
   * @param user The user to be removed.
   */
  removeUser(user: User): void {
    this.users.delete(user.getUUID());
    if (user.getChannels().has(this)) {
      user.removeChannel(this);
    }
  }

  /**
   * Retrieves the user owning this Private Channel.
   * @returns The user representing the owner.
   */
  getOwner(): User {
    const owner = aaainstance.getUser(this.owner);
    if (owner === undefined) {
      throw new Error('impossible, perhaps if we allow deletion of users this is possible');
    }
    return owner;
  }
  /**
   * Connects a user to the channel and adds them to the members if needed.
   * @param user
   */
  override systemAddConnected(user: User): void {
    if (this.connected.has(user.getUUID())) {
      return;
    } else {
      this.connected.add(user.getUUID());
      if (!this.users.has(user.getUUID())) {
        this.users.add(user.getUUID());
      }
    }
  }

  /**
   * Makes a JSON representation of this private channel.
   * @returns A JSON represenation of this directmessage channel.
   */
  toJSON() {
    return {
      CUID: this.CUID,
      name: this.name,
      messages: this.messages,
      users: this.users,
      DATECREATED: this.DATECREATED,
      owner: this.owner,
      channelType: 'PrivateChannel',
    };
  }
}
