/* eslint-disable @typescript-eslint/no-unsafe-assignment */
//Author: Barteld Van Nieuwenhove
//Date: 2022/10/31

import type { Message } from '../message/message.js';
import type { User } from '../user/user.js';
import type { UUID } from '../user/uuid.js';
import { CUID } from './cuid.js';
import { serverInstance } from '../chat-server/chat-server-script.js';

/**
 * @abstract @class Channel
 *
 * @protected {CUID} channel unique identifier.
 * @protected {name} string name of the channel.
 * @protected {messages} array of message objects.
 * @protected {users} set of all UUID of the users that are part of the channel.
 * @protected {connected} set of all UUID of the users currently watching the channel.
 * @protected {DATCREATED} number of the time in miliseconds since epoch the channel was created.
 */
export abstract class Channel {
  protected CUID: CUID;
  protected name: string;
  protected messages: Message[];
  protected users: Set<UUID>;
  protected connected: Set<UUID>;
  protected DATECREATED: number;

  /**
   * @constructs @abstract Channel
   * @param name string name of the channel.
   * @param isDummy boolean passed for constucting dummy channel, assumed to not exist and which won't be saved anywhere.
   */
  constructor(name: string, isDummy?: boolean) {
    let savedChannel;
    if (!isDummy) {
      savedChannel = serverInstance.getChannel(name);
    }
    if (savedChannel !== undefined) {
      this.CUID = savedChannel.CUID;
      this.name = savedChannel.name;
      this.messages = savedChannel.messages;
      this.users = savedChannel.users;
    } else {
      this.CUID = new CUID();
      this.name = name;
      this.messages = new Array<Message>();
      this.users = new Set<UUID>();
      //save in extensions of abstract class not here.
    }
    this.connected = new Set<UUID>();
    this.DATECREATED = Date.now();
    // cache in extensions of abstract class not here.
  }

  /**
   * Retrieves the CUID of this channel.
   * @returns The CUID associated with this channel.
   */
  getCUID(): CUID {
    return this.CUID;
  }

  /**
   * Overrides this channel's current name with a new one.
   * @param newName A string representing the new name.
   */
  setName(newName: string): void {
    if (this.name === newName) return;
    if (serverInstance.getChannel(newName) === undefined) this.name = newName;
  }

  /**
   * Gets this channel's name.
   * @returns This channel's name.
   */
  getName(): string {
    return this.name;
  }

  /**
   * Retrieves all users that are part of this channel.
   * @returns A set of all users part of this channel.
   */
  getUsers(): Set<User> {
    const users = new Set<User>();
    for (const UUID of this.users) {
      const user = serverInstance.getUser(UUID);
      if (user !== undefined) users.add(user);
    }
    return users;
  }

  /**
   * Retrieves all users currently connected to this channel.
   * @returns A set of all users connected to this channel.
   */
  getConnectedUsers(): Set<User> {
    const users = new Set<User>();
    for (const UUID of this.connected) {
      const user = serverInstance.getUser(UUID);
      if (user !== undefined) users.add(user);
    }
    return users;
  }

  /**
   * Gets either all or a specified number of messages from this channel.
   * @param numberOfMessages Number of messages you wish to get.
   * @returns Returns either a specific number of messsages or all messages in an Array.
   */
  getMessages(numberOfMessages?: number): Array<Message> {
    const messages = new Array<Message>();
    if (numberOfMessages !== undefined) {
      for (let i = this.messages.length - 1; i >= 0 && numberOfMessages >= this.messages.length - i; i--) {
        const message = this.messages[i];
        if (message !== undefined) {
          messages.push(message);
        }
      }
      return messages;
    } else return this.messages;
  }

  /**
   * Gets the last message sent in this channel.
   * @returns The last message in a channel if not empty, undefined otherwise.
   */
  getLastMessage(): Message | undefined {
    return this.messages[this.messages.length - 1];
  }

  /**
   * Adds a message to this channel.
   * @param message Message to be added to the channel.
   */
  addMessage(message: Message): void {
    this.messages.push(message);
  }

  /**
   * Retrieves the time of when this channel was created.
   * @returns The time since epoch (January 1st 1970) in miliseconds that this channel has been created.
   */
  getDateCreated(): number {
    return this.DATECREATED;
  }

  /**
   * Checks whether a user is a member of this channel.
   * @param user User to be checked whether they're a member of this channel.
   * @returns True if the user is a member of this channel.
   */
  isMember(user: User): boolean {
    return this.users.has(user.getUUID());
  }

  /**
   * Checks whether a user is connected to this channel.
   * @param user User to be checked whether they're connected.
   * @returns True if the user is currently connected to this channel, false otherwise.
   */
  isConnected(user: User): boolean {
    return this.connected.has(user.getUUID());
  }

  /**
   * Checks whether a channel has users connected to it.
   * @returns True if the channel has users connected to it, false otherwise.
   */
  isActive(): boolean {
    return serverInstance.isActiveChannel(this);
  }

  /**
   * Adds a user to the list of connected users of this channel.
   * @param user A user to be connected to this channel.
   */
  systemAddConnected(user: User): void {
    if (this.connected.has(user.getUUID())) {
      return;
    } else {
      this.connected.add(user.getUUID());
    }
  }

  /**
   * Removes a user from the list of connected users of this channel.
   * @param user A user to be disconnected from this channel.
   */
  systemRemoveConnected(user: User): void {
    this.connected.delete(user.getUUID());
  }
}
