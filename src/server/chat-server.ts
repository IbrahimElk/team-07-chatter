// author: Barteld Van Nieuwenhove,El Kaddouri Ibrahim
// date: 2023-3-23
import type { RawData } from 'ws';
import type { IncomingMessage } from 'node:http';
import type { IWebSocket, IWebSocketServer } from '../protocol/ws-interface.js';
import type { User } from '../objects/user/user.js';
import { ServerComms } from '../server-dispatcher/server-communication.js';
import { userLoad, userSave, userDelete } from '../database/user_database.js';
import { publicChannelLoad, channelSave, friendChannelLoad, channelDelete } from '../database/channel_database.js';

// For easier to read code.
export type UserId = string;
export type ChannelId = string;
export type ChannelName = string;

import Debug from 'debug';
import type { PublicChannel } from '../objects/channel/publicchannel.js';
import type { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { serverSave } from '../database/server_database.js';
const debug = Debug('ChatServer.ts');

export class ChatServer {
  private uuid: Set<UserId>;
  private cuid: Set<ChannelId>;
  private cachedUsers: Map<UserId, User>;
  private cachedPublicChannels: Map<ChannelId, PublicChannel>;
  private cachedFriendChannels: Map<ChannelId, DirectMessageChannel>;
  server: IWebSocketServer;
  private webSocketToUserId: Map<IWebSocket, UserId>;
  private started = false;
  // private ended: Promise<void>; // FIXME: WAAROM NODIG?

  constructor(server: IWebSocketServer, uuid: Set<string>, cuid: Set<string>, start = true) {
    this.cuid = cuid;
    this.uuid = uuid;
    this.cachedUsers = new Map<UserId, User>();
    this.cachedPublicChannels = new Map<ChannelId, PublicChannel>();
    this.cachedFriendChannels = new Map<ChannelId, DirectMessageChannel>();
    this.webSocketToUserId = new Map<IWebSocket, UserId>();
    this.server = server;
    if (start) {
      this.start();
    }
    // this.ended = new Promise<void>((resolve, _reject) => {
    //   this.server.on('close', () => resolve);
    // });
  }

  // --------------------------------------------------
  // WEBSOCKET HANDLERS
  // --------------------------------------------------

  start() {
    if (this.started) return;
    this.server.on('connection', (ws: IWebSocket, request: IncomingMessage | string | undefined) =>
      this.onConnection(ws, request)
    );
    this.server.on('error', (error: Error) => this.onServerError(error));
    this.server.on('close', async () => await this.onServerClose());
    this.started = true;
  }

  // FIXME: wat moet er hier gebeuren??
  onServerError(error: Error) {
    debug('WebSocketServer error: %o', error);
  }
  async onServerClose() {
    // FIXME: Close all sockets, How to use IWebSocketEvents??
    // this.server.close();

    for (const user of this.cachedUsers.values()) {
      await this.unCacheUser(user);
    }
    for (const friendChannel of this.cachedFriendChannels.values()) {
      await this.removeCacheFriendhannel(friendChannel);
    }
    for (const publicChannel of this.cachedPublicChannels.values()) {
      await this.removeCachePublicChannel(publicChannel);
    }

    // Save server state
    await serverSave(this);
    debug('WebSocketServer closed and state saved');
  }

  /**
   * Install listeners when a new client connects.
   * @param ws The WebSocket of the new client.
   * @param request
   */
  onConnection(ws: IWebSocket, request: IncomingMessage | string | undefined) {
    const ip = typeof request === 'string' ? request : request?.socket?.remoteAddress ?? '{unknown IP}';
    debug(`Connection from ${ip}, current number of connected clients is ${this.server.clients.size}`);
    // Now install a listener for messages from this client:
    ws.on('message', async (data: RawData, isBinary: boolean) => await this.onClientRawMessage(ws, data, isBinary));
    ws.on('close', async (code: number, reason: Buffer) => await this.onClientClose(code, reason, ws));
  }

  async onClientRawMessage(ws: IWebSocket, data: RawData, _isBinary: boolean) {
    debug('Received raw message %o', data);
    const msg: string = data.toString();
    debug('inside chat-server.ts onClientRawMessage()');
    await ServerComms.dispatcherServer(msg, ws, this);
  }

  async onClientClose(code: number, reason: Buffer, ws: IWebSocket) {
    const user: User | undefined = await this.getUserByWebsocket(ws);
    if (user) {
      await this.unCacheUser(user);
    }
    debug('Client closed connection: %d: %s', code, reason.toString());
  }

  // ------------------------------------------------------
  // USERS
  // ------------------------------------------------------
  public async getUserByUserId(identifier: UserId): Promise<User | undefined> {
    if (!this.uuidAlreadyInUse(identifier)) {
      return undefined;
    }

    const cachedUser = this.cachedUsers.get(identifier);
    if (cachedUser !== undefined) {
      return cachedUser;
    }

    const user = await userLoad(identifier);
    if (user !== undefined) {
      this.cachedUsers.set(identifier, user);
    }
    return user;
  }

  public async getUserByWebsocket(ws: IWebSocket): Promise<User | undefined> {
    const userId = this.webSocketToUserId.get(ws);
    if (userId !== undefined) {
      return await this.getUserByUserId(userId);
    }
    return undefined;
  }
  public getCachedUsers() {
    return new Set(Array.from(this.cachedUsers.values()));
  }
  // ______________ IS _________________
  public uuidAlreadyInUse(identifier: UserId): boolean {
    debug('uuid already in server? ', this.uuid.has(identifier), this.uuid, identifier);
    if (this.uuid.has(identifier)) {
      return true;
    }
    return false;
  }
  public isCachedUser(user: User): boolean {
    return this.cachedUsers.has(user.getUUID());
  }
  // ____________ SETTERS ________________
  public cachUser(user: User): void {
    this.uuid.add(user.getUUID());
    this.cachedUsers.set(user.getUUID(), user);
    const websocket = user.getWebSocket();
    if (websocket !== undefined) {
      this.webSocketToUserId.set(websocket, user.getUUID());
    }
  }

  public async unCacheUser(user: User): Promise<void> {
    debug('unCacheUser');
    await userSave(user);

    this.cachedUsers.delete(user.getUUID());
    const websocket = user.getWebSocket();
    if (websocket !== undefined) {
      this.webSocketToUserId.delete(websocket);
    }
  }

  // ----------------------------------------------
  // CHANNELS
  // ----------------------------------------------
  public async getPublicChannelByChannelId(identifier: string): Promise<PublicChannel | undefined> {
    if (!this.cuidAlreadyInUse(identifier)) {
      return undefined;
    }

    const cachedChannel = this.cachedPublicChannels.get(identifier);
    if (cachedChannel !== undefined) {
      return cachedChannel;
    }
    const channel = await publicChannelLoad(identifier);
    if (channel !== undefined) {
      this.cachedPublicChannels.set(identifier, channel);
    }
    return channel;
  }
  public async getFriendChannelByChannelId(identifier: string): Promise<DirectMessageChannel | undefined> {
    if (!this.cuidAlreadyInUse(identifier)) {
      return undefined;
    }

    const cachedChannel = this.cachedFriendChannels.get(identifier);
    if (cachedChannel !== undefined) {
      return cachedChannel;
    }
    const channel = await friendChannelLoad(identifier);
    if (channel !== undefined) {
      this.cachedFriendChannels.set(identifier, channel);
    }

    return channel;
  }

  public getCachedFriendChannels() {
    return new Set(Array.from(this.cachedFriendChannels.values()));
  }
  public getCachedPublicChannels() {
    return new Set(Array.from(this.cachedPublicChannels.values()));
  }
  // ______________ IS _________________
  public cuidAlreadyInUse(identifier: ChannelId): boolean {
    if (this.cuid.has(identifier)) {
      return true;
    }
    return false;
  }
  public isCachedFriendChannel(channel: DirectMessageChannel): boolean {
    return this.cachedFriendChannels.has(channel.getCUID());
  }
  public isCachedPublicChannel(channel: PublicChannel): boolean {
    return this.cachedPublicChannels.has(channel.getCUID());
  }

  // ____________ SETTERS ________________
  public setCacheFriendChannel(channel: DirectMessageChannel): void {
    this.cachedFriendChannels.set(channel.getCUID(), channel);
    this.cuid.add(channel.getCUID());
  }
  public setCachePublicChannel(channel: PublicChannel): void {
    this.cachedPublicChannels.set(channel.getCUID(), channel);
    this.cuid.add(channel.getCUID());
  }
  // --------
  public async removeCachePublicChannel(channel: PublicChannel): Promise<void> {
    await channelSave(channel); // FIXME: channelsave error, thowing error, then still delte from cached...
    this.cachedPublicChannels.delete(channel.getCUID());
  }
  public async removeCacheFriendhannel(channel: DirectMessageChannel): Promise<void> {
    await channelSave(channel); // FIXME: channelsave error, thowing error, then still delte from cached...
    this.cachedFriendChannels.delete(channel.getCUID());
  }
  // --------
  public deletePublicChannel(channel: PublicChannel) {
    channelDelete(channel);
    this.cachedPublicChannels.delete(channel.getCUID());
  }
  public deleteFriendChannel(channel: DirectMessageChannel) {
    channelDelete(channel);
    this.cachedFriendChannels.delete(channel.getCUID());
  }

  /**
   * Makes a JSON representation of this server.
   * @returns A JSON represenation of this server.
   */
  toJSON() {
    return {
      uuid: Array.from(this.uuid),
      cuid: Array.from(this.cuid),
    };
  }
}
