//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';
import { CUID } from '../channel/cuid.js';
import { userLoad, userSave } from '../database/user_database.js';
import { channelLoad, channelSave } from '../database/channel_database.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

export class Server {
  private cachedUsers: Map<string, User>;
  private cachedChannels: Map<string, Channel>;
  private connectedUsers: Set<UUID>;
  private activeChannels: Set<CUID>;
  private webSocketToUUID: Map<IWebSocket, UUID>;
  private nameToUUID: Map<string, UUID>;
  private nameToCUID: Map<string, CUID>;

  constructor(nameToUUID: Map<string, UUID>, nameToCUID: Map<string, CUID>) {
    this.cachedUsers = new Map<string, User>();
    this.cachedChannels = new Map<string, Channel>();
    this.connectedUsers = new Set<UUID>();
    this.activeChannels = new Set<CUID>();
    this.webSocketToUUID = new Map<IWebSocket, UUID>();
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
      let user = this.cachedUsers.get(identifier.toString());
      if (user !== undefined) {
        return user;
      }
      user = userLoad(identifier);
      if (user !== undefined) {
        this.cachedUsers.set(identifier.toString(), user);
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

  /**
   * Checks whether a user is connected to the server.
   * @param user User to be checked whether they're connected.
   * @returns True if the user is connected to the server, false otherwise.
   */
  isConnectedUser(user: User): boolean {
    if (this.connectedUsers.has(user.getUUID())) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether a channel is active. Active means that there are users currently connected to this channel.
   * @param channel Channel to be checked whether they're active.
   * @returns True if the channel is active, false otherwise.
   */
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
      let channel = this.cachedChannels.get(identifier.toString());
      if (channel !== undefined) {
        return channel;
      }
      channel = channelLoad(identifier);
      if (channel !== undefined) {
        this.cachedChannels.set(identifier.toString(), channel);
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
    if (!this.connectedUsers.has(user.getUUID())) {
      this.connectedUsers.add(user.getUUID());
      const websocket = user.getWebSocket();
      if (websocket !== undefined) {
        this.webSocketToUUID.set(websocket, user.getUUID());
      }
    }
  }

  /**
   * Makes a channel an active channel.
   * @param channel Channel to be set active.
   */
  systemSetActiveChannel(channel: Channel): void {
    if (!this.activeChannels.has(channel.getCUID())) {
      this.activeChannels.add(channel.getCUID());
    }
  }

  /**
   * Disconnects a user from this server and saves their data do the disk.
   * @param user User to be disconnected.
   */
  systemDisconnectUser(user: User): void {
    userSave(user);
    this.connectedUsers.delete(user.getUUID());
  }

  /**
   * Disconnects a channel from this server and saves the data.
   * @param channel Channel to be disconnected
   */
  systemDisconnectChannel(channel: Channel): void {
    channelSave(channel);
    this.activeChannels.delete(channel.getCUID());
  }

  /**
   * Adds a user to this server's cache.
   * @param user User to be added.
   */
  systemCacheUser(user: User): void {
    this.cachedUsers.set(user.getUUID().toString(), user);
    this.nameToUUID.set(user.getName(), user.getUUID());
  }

  /**
   * Removes a user from this server's cache.
   * @param user User to be removed.
   */
  systemUncacheUser(user: User): void {
    this.cachedUsers.delete(user.getUUID().toString());
  }

  /**
   * Adds a channel to this server's cache.
   * @param channel Channel to be added.
   */
  systemCacheChannel(channel: Channel): void {
    this.cachedChannels.set(channel.getCUID().toString(), channel);
    this.nameToCUID.set(channel.getName(), channel.getCUID());
  }

  /**
   * Removes a channel from this server's cache.
   * @param channel Channel to be removed.
   */
  systemUncacheChannel(channel: Channel): void {
    this.cachedChannels.delete(channel.getCUID().toString());
  }

  systemRenameUser(user: User, newName: string) {
    this.nameToUUID.delete(user.getName());
    this.nameToUUID.set(newName, user.getUUID());
  }

  getCachedChannels() {
    const channelSet = new Set<Channel>();
    for (const channel of this.cachedChannels.values()) {
      channelSet.add(channel);
    }
    return channelSet;
  }
  getCachedUsers() {
    const userSet = new Set<User>();
    for (const user of this.cachedUsers.values()) {
      userSet.add(user);
    }
    return userSet;
  }

  /**
   * Makes a JSON representation of this server.
   * @returns A JSON represenation of this server.
   */
  toJSON() {
    return { nameToUUID: Object.fromEntries(this.nameToUUID), nameToCUID: Object.fromEntries(this.nameToCUID) };
  }
}
