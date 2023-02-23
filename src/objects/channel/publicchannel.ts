//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import { serverInstance } from '../../server/chat-server-script.js';
import type { User } from '../user/user.js';
import { Channel } from './channel.js';

/**
 * @class PublicChannel @extends Channel
 *
 * @private {owner} UUID of the owner of the channel.
 */
export class PublicChannel extends Channel {
  private owner: string;

  /**
   * @constructs PublicChannel
   * @param name Name of the channel.
   * @param owner User representing the owner of this Channel.
   * @param isDummy Boolean passed for constucting dummy channel, assumed to not exist and which won't be saved anywhere.
   */
  constructor(name: string, owner: User, isDummy?: boolean) {
    super(name, isDummy);
    let savedChannel;
    if (!isDummy) {
      savedChannel = serverInstance.getChannel(name);
    }
    if (savedChannel !== undefined && savedChannel instanceof PublicChannel && !isDummy) {
      this.owner = savedChannel.owner;
      this.addUser(owner);
    } else {
      this.owner = owner.getUUID();
      this.users.add(owner.getUUID());
      //save in extensions of abstract class not here.
    }
    if (!isDummy) {
      serverInstance.systemCacheChannel(this);
    }
  }
  /**
   * Adds specified user to this channel.
   * @param user The user to be added to this Public Channel.
   */
  addUser(user: User): void {
    if (this.users.has(user.getUUID())) return;
    this.users.add(user.getUUID());
    if (!user.getChannels().has(this)) {
      user.addChannel(this);
    }
  }

  /**
   * Removes specified user from this channel.
   * @param user The user to be removed from this Public Channel.
   */
  removeUser(user: User): void {
    this.users.delete(user.getUUID());
    if (user.getChannels().has(this)) {
      user.removeChannel(this);
    }
  }

  /**
   * Retrieves the user owning this Public Channel.
   * @returns The user representing the owner.
   */
  getOwner(): User {
    const owner = serverInstance.getUser(this.owner);
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
      owner: this.owner,
      channelType: 'PublicChannel',
    };
  }
}
