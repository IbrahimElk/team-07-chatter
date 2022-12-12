//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Channel } from '../channel/channel.js';
import { UUID } from './uuid.js';
import { CUID } from '../channel/cuid.js';
import { PublicChannel } from '../channel/publicchannel.js';
import { PrivateChannel } from '../channel/privatechannel.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import { serverInstance } from '../database/server_database.js';

/**
 * @class User
 *
 * @private {UUID} user unique identifier.
 * @private {name} string name of the user.
 * @private {password} string password of the user.
 * @private {channels} set of CUID of all channels this user is a member of.
 * @private {friends} set of UUID of all users this user is friends with.
 * @private {ngramMap} map of strings pointing to the number representing the time in miliseconds it took to type.
 * @private {NgramMapCounter} map of strings pointing to the number of times we've counted these for taking the averages
 * @private {connectedChannel} CUID of the currently connected channel.
 * @private {timeConnectedChannel} number of time in miliseconds since epoch this user joined their current channel.
 * @private {timeConnectedServer} number of time in miliseconds since epoch this user connected to the server.
 * @private {DATCREATED} number of the time in miliseconds since epoch the channel was created.
 * @private {webSocket} websocket for communicating from server to the user's client.
 */
export class User {
  private UUID: UUID;
  private name: string;
  private password: string;
  private channels: Set<CUID>;
  private friends: Set<UUID>;
  private averageNgrams: Map<string, number>;
  private ngramCounter: Map<string, number>;
  private connectedChannel: CUID;
  private timeConnectedChannel: number;
  private timeConnectedServer: number;
  private DATECREATED: number;
  private webSocket: IWebSocket | undefined;

  /**
   * @constructs User
   * Returns an existing user of name and password match to an existing user.
   * Connects them to the server and gets cached if websocket defined.
   * @param name string name of the user.
   * @param password string password of the user.
   * @param webSocket websocket for communicating from server to the user's client.
   * @param isDummy Boolean passed for constucting dummy user, assumed to not exist and which won't be saved anywhere.
   */
  constructor(name: string, password: string, webSocket?: IWebSocket, isDummy?: boolean) {
    let savedUser;
    if (!isDummy) {
      savedUser = serverInstance.getUser(name);
    }
    //login
    if (savedUser !== undefined) {
      this.UUID = savedUser.UUID;
      this.name = savedUser.name;
      this.password = savedUser.password;
      this.channels = savedUser.channels;
      this.friends = savedUser.friends;
      this.averageNgrams = savedUser.averageNgrams;
      this.ngramCounter = savedUser.ngramCounter;
      this.DATECREATED = savedUser.DATECREATED;
    }
    //register
    else {
      this.UUID = new UUID();
      this.name = name;
      this.password = password;
      this.channels = new Set<CUID>();
      this.friends = new Set<UUID>();
      this.averageNgrams = new Map<string, number>();
      this.ngramCounter = new Map<string, number>();
      this.DATECREATED = Date.now();
    }
    this.connectedChannel = new CUID();
    this.connectedChannel.defaultChannel();
    this.timeConnectedChannel = Date.now();
    this.timeConnectedServer = Date.now();
    this.webSocket = webSocket;
    if (this.password === password && !isDummy) {
      if (this.webSocket !== undefined) {
        serverInstance.systemConnectUser(this);
      }
      serverInstance.systemCacheUser(this);
    }
  }

  /**
   * Adds a user to this user's set of friends.
   * @param friend The user being added to this user's friends.
   */
  addFriend(friend: User): void {
    if (this.friends.has(friend.getUUID() || this === friend)) {
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
    if (serverInstance.getUser(newName) === undefined) {
      serverInstance.systemRenameUser(this, newName);
      this.name = newName;
    }
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
      const friend = serverInstance.getUser(UUID);
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
      const channel = serverInstance.getChannel(CUID);
      if (channel !== undefined) channels.add(channel);
    }
    return channels;
  }

  /**
   * Retreives channel this user is currently connected to.
   * @returns The channel this user is currently connected to, if none it returns the default channel.
   */
  getConnectedChannel(): Channel {
    const channel = serverInstance.getChannel(this.connectedChannel);
    if (channel !== undefined) return channel;
    else throw new Error('Connected channel is undefined!');
  }

  /**
   * Sets the channel this user is currently connected to. If this user has never connected to this channel it gets saved to this users saved channels.
   * @param newChannel The channel to connect this user to.
   */
  setConnectedChannel(newChannel: Channel): void {
    if (this.connectedChannel.toString() === '#0') return;
    const oldChannel = serverInstance.getChannel(this.connectedChannel);
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
   * Retrieves the server to client websocket.
   * @returns The websocket for communicating from server to client if this user is connected to the server, undefined otherwise.
   */
  getWebSocket() {
    return this.webSocket;
  }

  /**
   * Checks whether this user is connected to the server by whether its websockets are defined.
   * @returns Whether this user is connected to the server or not.
   */
  isConnected(): boolean {
    return serverInstance.isConnectedUser(this);
  }

  /**
   * Retrieves the ngram map of this user.
   * @returns The ngram map of this user.
   */
  getNgrams(): Map<string, number> {
    return new Map(this.averageNgrams);
  }

  /**
   * Averages out a new ngram
   * @param newNgram the new ngram values to be added to the User
   */
  setNgrams(newNgram: Map<string, number>): void {
    for (const element of newNgram) {
      this.ChangeStateUser(element, this.averageNgrams, this.ngramCounter);
    }
  }
  /**
   * M_k−1 + (x_k − M_k−1)/k
   * @param newValue
   * @param oldValue
   * @param counter
   * @returns
   */
  private CalculateNewMean(newValue: number, oldValue: number, counter: number): number {
    const NewMeanOfUser = oldValue + (newValue - oldValue) / counter;
    return NewMeanOfUser;
  }
  /**
   *
   * @param NewNgramElement
   * @param NgramMean
   * @param NgramCounter
   */
  private ChangeStateUser(
    NewNgramElement: [string, number],
    NgramMean: Map<string, number>,
    NgramCounter: Map<string, number>
  ) {
    let ngramCount = NgramCounter.get(NewNgramElement[0]);
    const nrgammean = NgramMean.get(NewNgramElement[0]);
    if (ngramCount !== undefined && nrgammean !== undefined) {
      const newMean: number = this.CalculateNewMean(NewNgramElement[1], nrgammean, ngramCount);
      this.averageNgrams.set(NewNgramElement[0], newMean);
      this.ngramCounter.set(NewNgramElement[0], ngramCount++);
    }
  }

  /**
   * Makes a JSON representation of this user.
   * @returns A JSON represenation of this user.
   */
  toJSON() {
    return {
      UUID: this.UUID,
      name: this.name,
      password: this.password,
      channels: [...this.channels],
      friends: [...this.friends],
      averageNgrams: Array.from(this.averageNgrams.entries()),
      ngramCounter: Array.from(this.ngramCounter.entries()),
      DATECREATED: this.DATECREATED,
    };
  }
}
