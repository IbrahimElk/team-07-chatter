//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import { User } from '../user/user.js';
import { UUID } from '../user/uuid.js';
import { CUID } from '../channel/cuid.js';

export class Server {
  private channels: Map<CUID, Channel>;
  private users: Map<UUID, User>;
  private connectedUsers: Set<UUID>;
  private nameToUUID: Map<string, UUID>;
  private nameToCUID: Map<string, CUID>;

  constructor(nameToUUID: Map<string, UUID>, nameToCUID: Map<string, CUID>) {
    this.channels = new Map<CUID, Channel>();
    this.users = new Map<UUID, User>();
    this.connectedUsers = new Set<UUID>();
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
      // user = database.userLoad(identifier) //IMPLEMENT
      // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      // const savedUser: User = JSON.parse(
      //   JSON.stringify({
      //     UUID: { UUID: '$6be96359-042f-45de-b54c-a721b812d154' },
      //     name: 'Hellooooo',
      //     password: 'woorld',
      //     channels: {},
      //     friends: {},
      //     DATECREATED: 16685649,
      //   })
      // );
      // user = Object.assign(new User('anyvalueforinitalizing', 'anyvalueforinitalizing'), savedUser);
      console.log(user);
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
   * Connects a user to this server.
   * @param user User to be connected.
   */
  ConnectUser(user: User): void {
    if (!user.isConnected()) return;
    this.users.set(user.getUUID(), user);
    if (!this.connectedUsers.has(user.getUUID())) {
      this.connectedUsers.add(user.getUUID());
    }
  }

  /**
   * Disconnects a user from this server and saves their data do the disk.
   * @param user User to be disconnected.
   */
  DisconnectUser(user: User): void {
    //save user method TODO
    this.connectedUsers.delete(user.getUUID());
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
   * Gets a channel based on a unique identifier.
   * @param identifier Either a CUID or the name of a channel
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

  systemAddUser(user: User) {
    this.users.set(user.getUUID(), user);
    this.nameToUUID.set(user.getName(), user.getUUID());
  }

  systemRemoveUser(user: User) {
    this.users.delete(user.getUUID());
  }

  /**
   * Adds a channel to this server.
   * @param channel Channel to be added to this server.
   */
  systemAddChannel(channel: Channel) {
    this.channels.set(channel.getCUID(), channel);
    this.nameToCUID.set(channel.getName(), channel.getCUID());
  }

  /**
   * Removes a channel from this server.
   * @param channel Channel to be removed from this server.
   */
  systemRemoveChannel(channel: Channel) {
    this.channels.delete(channel.getCUID());
  }
}
export const server = new Server(new Map<string, UUID>(), new Map<string, CUID>());
function Start() {
  //loadJosns();
}
function Stop() {}
