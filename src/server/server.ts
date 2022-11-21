//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';
import { CUID } from '../channel/cuid.js';

export class Server {
  private channels: Map<CUID, Channel>;
  private users: Map<UUID, User>;
  private connectedUsers: Set<UUID>;
  private activeChannels: Set<CUID>;
  private nameToUUID: Map<string, UUID>;
  private nameToCUID: Map<string, CUID>;

  constructor(nameToUUID: Map<string, UUID>, nameToCUID: Map<string, CUID>) {
    this.channels = new Map<CUID, Channel>();
    this.users = new Map<UUID, User>();
    this.connectedUsers = new Set<UUID>();
    this.activeChannels = new Set<CUID>();
    this.nameToUUID = nameToUUID;
    this.nameToCUID = nameToCUID;
  }

  /**
   * Looks for a user given either its UUID or its name.
   * @param identifier is either the UUID or the name of the user being searched
   * @returns If found the user corresponding to the given UUID or name, undefined otherwise.
   */
  getUser(identifier: UUID | string): User | undefined {
    if (identifier instanceof UUID) {
      const user = this.users.get(identifier);
      if (user !== undefined) {
        return user;
      }
      //user = loadSavedUser()
      if (user !== undefined) {
        this.users.set(identifier, user);
        return user;
      } else {
        return undefined;
      }
    } else {
      const UUID = this.nameToUUID.get(identifier);
      if (UUID === undefined) {
        return undefined;
      } else {
        return this.getUser(UUID);
      }
    }
  }

  /**
   * Retrieves all users connected to this server.
   * @returns Set of all connected users.
   */
  getConnectedUsers(): Set<User> {
    const users = new Set<User>();
    for (const uuid of this.connectedUsers) {
      const user = this.getUser(uuid);
      if (user !== undefined) {
        users.add(user);
      }
    }
    return users;
  }

  isConnectedUser(user: User): boolean {
    if (this.connectedUsers.has(user.getUUID())) {
      return true;
    }
    return false;
  }

  isActiveChannel(channel: Channel): boolean {
    if (this.activeChannels.has(channel.getCUID())) {
      return true;
    }
    return false;
  }

  /**
   * Gets a channel based on a unique identifier.
   * @param identifier Either a CUID or the name of a channel.
   * @returns The channel associated with the identifier, undefined if non found.
   */
  getChannel(identifier: CUID | string): Channel | undefined {
    if (identifier instanceof CUID) {
      const channel = this.channels.get(identifier);
      if (channel !== undefined) {
        return channel;
      }
      // channel = database.channelLoad(identifier) //IMPLEMENT
      if (channel !== undefined) {
        this.channels.set(identifier, channel);
        return channel;
      } else {
        return undefined;
      }
    } else {
      const CUID = this.nameToCUID.get(identifier);
      if (CUID === undefined) {
        return undefined;
      } else {
        return this.getChannel(CUID);
      }
    }
  }

  /**
   * Connects a user to this server.
   * @param user User to be connected.
   */
  systemConnectUser(user: User): void {
    this.users.set(user.getUUID(), user);
    if (!this.connectedUsers.has(user.getUUID())) {
      this.connectedUsers.add(user.getUUID());
    }
  }

  systemSetActiveChannel(channel: Channel): void {
    this.channels.set(channel.getCUID(), channel);
    if (!this.activeChannels.has(channel.getCUID())) {
      this.activeChannels.add(channel.getCUID());
    }
  }

  /**
   * Disconnects a user from this server and saves their data do the disk.
   * @param user User to be disconnected.
   */
  systemDisconnectUser(user: User): void {
    //save user method TODO
    this.connectedUsers.delete(user.getUUID());
    this.systemUncacheUser(user);
  }

  systemDisconnectChannel(channel: Channel) {
    //save channel method TODO
    this.activeChannels.delete(channel.getCUID());
    this.systemUncacheChannel(channel);
  }

  /**
   * Adds a user to this server's cache.
   * @param user User to be added.
   */
  systemCacheUser(user: User): void {
    this.users.set(user.getUUID(), user);
    this.nameToUUID.set(user.getName(), user.getUUID());
  }

  /**
   * Removes a user from this server's cache.
   * @param user User to be removed.
   */
  systemUncacheUser(user: User): void {
    this.users.delete(user.getUUID());
  }

  /**
   * Adds a channel to this server's cache.
   * @param channel Channel to be added.
   */
  systemCacheChannel(channel: Channel): void {
    this.channels.set(channel.getCUID(), channel);
    this.nameToCUID.set(channel.getName(), channel.getCUID());
  }

  /**
   * Removes a channel from this server's cache.
   * @param channel Channel to be removed.
   */
  systemUncacheChannel(channel: Channel): void {
    this.channels.delete(channel.getCUID());
    // delete file
  }
}
export const server = new Server(new Map<string, UUID>(), new Map<string, CUID>());
