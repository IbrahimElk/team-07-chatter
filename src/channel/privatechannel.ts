//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { server } from '../server/server.js';
import { Channel } from './channel.js';
import { ChannelType, CUID } from './cuid.js';

export class PrivateChannel extends Channel {
  private owner: UUID;

  constructor(name: string, owner: User) {
    super(name);
    super.systemSetCUID(new CUID(ChannelType.PRIVATECHANNEL));
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
    const owner = server.getUser(this.owner);
    if (owner === undefined) {
      throw new Error('impossible, perhaps if we allow deletion of users this is possible');
    }
    return owner;
  }
}
