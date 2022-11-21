/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import type { WebSocket } from 'ws';
import { server } from '../server/server.js';
import { UUID } from './uuid.js';
import { ChannelType, CUID } from '../channel/cuid.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { PrivateChannel } from '../channel/privatechannel.js';
import { JSonSet } from '../Util/jsonSet.js';

//User identified by UUID
export class User {
  private UUID: UUID;
  private name: string;
  private password: string;
  private channels: JSonSet<CUID>;
  private friends: JSonSet<UUID>;
  private connectedChannel: CUID; //what if haven't joined channel? Perhaps default channel?
  private timeConnectedChannel: number;
  private timeConnectedServer: number;
  private DATECREATED: number;
  private clientToServerSocket: WebSocket | undefined;
  private serverToClientSocket: WebSocket | undefined;

  /**
   * Creates a user and connects them to the server.
   *
   * @param name The name of the user.
   * @param password The password of the user.
   * @param clientToServerSocket The websocket for communication from client to server.
   * @param serverToClientSocket The websocket for communication from server to client.
   */
  constructor(name: string, password: string, clientToServerSocket?: WebSocket, serverToClientSocket?: WebSocket) {
    const savedUser = server.getUser(name);
    //login
    if (savedUser !== undefined) {
      this.UUID = savedUser.UUID;
      this.name = savedUser.name;
      this.password = savedUser.password;
      this.channels = savedUser.channels;
      this.friends = savedUser.friends;
      this.DATECREATED = savedUser.DATECREATED;
    }
    //register
    else {
      this.UUID = new UUID();
      this.name = name;
      this.password = password;
      this.channels = new JSonSet<CUID>();
      this.friends = new JSonSet<UUID>();
      this.DATECREATED = Date.now();
    }
    this.connectedChannel = new CUID(); //way to add previous channel I guess by defining differently for login and register
    this.connectedChannel.defaultChannel();
    this.timeConnectedChannel = Date.now();
    this.timeConnectedServer = Date.now();
    this.clientToServerSocket = clientToServerSocket;
    this.serverToClientSocket = serverToClientSocket;
    if (this.clientToServerSocket !== undefined && this.serverToClientSocket !== undefined) {
      server.systemConnectUser(this);
    }
    server.systemCacheUser(this);
  }

  /**
   * Adds a user to this user's set of friends.
   * @param friend The user being added to this user's friends.
   */
  addFriend(friend: User): void {
    if (this.friends.has(friend.getUUID())) {
      return;
    }
    this.friends.add(friend.getUUID());
    friend.addFriend(this);
  }

  /**
   * Removes a user from this user's set of friends.
   * @param friend The user being removed from this user's friends.
   */
  removeFriend(friend: User): void {
    if (!this.friends.has(friend.getUUID())) {
      return;
    }
    this.friends.delete(friend.getUUID());
    friend.removeFriend(this);
  }

  /**
   * Checks whether a user is friends with this user.
   * @param friend The user being checked whether they are this user's friend.
   * @returns True if the given user is friends with this user, false otherwise.
   */
  isFriend(friend: User): boolean {
    return this.friends.has(friend.getUUID());
  }

  /**
   * Retrieves the UUID of this user.
   * @returns The UUID associated with this user
   */
  getUUID(): UUID {
    return this.UUID;
  }

  /**
   * Retrieves the name of this user.
   * @returns A string representing this user name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Overrides this user's current name with a new one.
   * @param newName A string representing the new name.
   */
  setName(newName: string): void {
    if (this.name === newName) return;
    if (server.getUser(newName) === undefined) this.name = newName;
  }

  /**
   * Retrieves the password of this user.
   * @returns The password of this user.
   */
  getPassword(): string {
    return this.password;
  }

  /**
   * Overrides this user's current password with a new one.
   * @param newPassword A string representing the new password.
   */
  setPassword(newPassword: string): void {
    //TODO: implement some checks of limited amount and type of characters.
    this.password = newPassword;
  }

  /**
   * Retrieves all friends of this user.
   * @returns A set of users representing all friends this user has.
   */
  getFriends(): Set<User> {
    const friends = new Set<User>();
    for (const UUID of this.friends) {
      const friend = server.getUser(UUID);
      if (friend !== undefined) {
        friends.add(friend);
      }
    }
    return friends;
  }

  /**
   * Adds a channel to this user's saved channels
   * @param channel The channel to be added to this user.
   */
  addChannel(channel: Channel): void {
    if (this.channels.has(channel.getCUID())) {
      return;
    }
    this.channels.add(channel.getCUID());
    if ((!channel.getUsers().has(this) && channel instanceof PublicChannel) || channel instanceof PrivateChannel) {
      channel.addUser(this);
    }
  }

  /**
   * Removes a channel from this user's saved channels
   * @param channel The channel to be removed from this user.
   */
  removeChannel(channel: Channel): void {
    this.channels.add(channel.getCUID());
    if ((channel.getUsers().has(this) && channel instanceof PublicChannel) || channel instanceof PrivateChannel) {
      channel.removeUser(this);
    }
  }

  /**
   * Checks whether a channel is saved to this user.
   * @param channel The channel to be checked wheter it's saved to this user
   * @returns a boolean indicating whether the channel has been saved to this user or not.
   */
  isPartOfChannel(channel: Channel): boolean {
    return this.channels.has(channel.getCUID());
  }

  /**
   * Retrieves the channels this user is a part of.
   * @returns A set with all channels this user is a part of.
   */
  getChannels(): Set<Channel> {
    const channels = new Set<Channel>();
    for (const CUID of this.channels) {
      const channel = server.getChannel(CUID);
      if (channel !== undefined) channels.add(channel);
    }
    return channels;
  }

  /**
   * Retreives channel this user is currently connected to.
   * @returns The channel this user is currently connected to, if none it returns the default channel.
   */
  getConnectedChannel(): Channel {
    const channel = server.getChannel(this.connectedChannel);
    if (channel !== undefined) return channel;
    else throw new Error('Connected channel is undefined!');
  }

  /**
   * Sets the channel this user is currently connected to. If this user has never connected to this channel it gets saved to this users saved channels.
   * @param newChannel The channel to connect this user to.
   */
  setConnectedChannel(newChannel: Channel): void {
    const oldChannel = server.getChannel(this.connectedChannel);
    if (oldChannel === undefined) return;
    oldChannel.systemRemoveConnected(this);
    this.connectedChannel = newChannel.getCUID();
    this.timeConnectedChannel = Date.now();
    // if this channel is already part of the saved channels list
    if (this.channels.has(newChannel.getCUID())) {
      return;
    } else {
      this.channels.add(newChannel.getCUID());
      newChannel.systemAddConnected(this);
    }
  }

  /**
   * Retrieves the time when this user connected to the server.
   * @returns The time since epoch (January 1st 1970) in miliseconds that this user has connected to the server.
   */
  getTimeConnectedServer(): number {
    return this.timeConnectedServer;
  }

  /**
   * Retrieves the time when this user last connected to a channel.
   * @returns The time since epoch (January 1st 1970) in miliseconds that this user has last connected to a channel.
   */
  getTimeConnectedChannel(): number {
    return this.timeConnectedChannel;
  }

  /**
   * Retrieves the time of when this user was created.
   * @returns The time since epoch (January 1st 1970) in miliseconds that this user has been created.
   */
  getDateCreated(): number {
    return this.DATECREATED;
  }

  /**
   * Retrieves the client to server websocket.
   * @returns The websocket for communicating from client to server if this user is connected to the server, undefined otherwise.
   */
  getClientToServerSocket(): WebSocket | undefined {
    return this.clientToServerSocket;
  }

  /**
   * Retrieves the server to client websocket.
   * @returns The websocket for communicating from server to client if this user is connected to the server, undefined otherwise.
   */
  getServerToClientSocket(): WebSocket | undefined {
    return this.serverToClientSocket;
  }

  /**
   * Checks whether this user is connected to the server by whether its websockets are defined.
   * @returns Whether this user is connected to the server or not.
   */
  isConnected(): boolean {
    return server.isConnectedUser(this);
  }
}
