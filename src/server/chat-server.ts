/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// author: Barteld Van Nieuwenhove,El Kaddouri Ibrahim
// date: 2023-3-23
import type { RawData } from 'ws';
import { IncomingMessage } from 'node:http';
import type { IWebSocket, IWebSocketServer } from '../front-end/proto/ws-interface.js';
import type { User } from '../objects/user/user.js';
import { ServerComms } from '../server-dispatcher/server-communication.js';
import { userLoad, userSave, userDelete } from '../database/user_database.js';
import { publicChannelLoad, channelSave, friendChannelLoad, channelDelete } from '../database/channel_database.js';
import { URL } from 'node:url'; // For easier to read code.
export type UUID = string;
export type ChannelId = string;
export type ChannelName = string;
export type sessionID = string;

import Debug from 'debug';
import type { PublicChannel } from '../objects/channel/publicchannel.js';
import type { DirectMessageChannel } from '../objects/channel/directmessagechannel.js';
import { serverSave } from '../database/server_database.js';
import { url } from 'node:inspector';
import { randomUUID } from 'node:crypto';
import type * as ServerTypes from '../front-end/proto/server-types.js';
const debug = Debug('ChatServer.ts');

export class ChatServer {
  private sessions: Map<sessionID, Set<IWebSocket>>; // session ID -> WebSocket connection
  private uuid: Set<UUID>;
  private cuid: Set<ChannelId>;
  private cachedUsers: Map<UUID, User>;
  private cachedPublicChannels: Map<ChannelId, PublicChannel>;
  private cachedFriendChannels: Map<ChannelId, DirectMessageChannel>;
  private serverWebSocket: IWebSocketServer;
  private sessionIDToUserId: Map<sessionID, UUID>;
  private started = false;
  // private ended: Promise<void>; // FIXME: WAAROM NODIG?

  constructor(server: IWebSocketServer, uuid: Set<string>, cuid: Set<string>, start = true) {
    this.cuid = cuid;
    this.uuid = uuid;
    this.cachedUsers = new Map<UUID, User>();
    this.cachedPublicChannels = new Map<ChannelId, PublicChannel>();
    this.cachedFriendChannels = new Map<ChannelId, DirectMessageChannel>();
    this.sessionIDToUserId = new Map<sessionID, UUID>();
    this.serverWebSocket = server;
    this.sessions = new Map<sessionID, Set<IWebSocket>>();
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
    this.serverWebSocket.on('connection', (ws: IWebSocket, request: IncomingMessage | string | undefined) => {
      if (request instanceof IncomingMessage) {
        if (request.url !== undefined) {
          const url = new URL(request.url, `http://${request.headers.host}`);
          const sessionID = url.searchParams.get('sessionID');
          console.log('Received connection with sessionID', sessionID);
          if (sessionID !== null) {
            const savedWebsokets = this.sessions.get(sessionID);
            if (savedWebsokets) {
              // TODO: delete other websockets that are closed.
              // Reuse existing WebSocket connection
              savedWebsokets.add(ws);
            }
          } else {
            // Create new WebSocket connection and assign session ID
            const newsessionID = randomUUID();
            this.sessions.set(newsessionID, new Set([ws]));
            const sendsessionID: ServerTypes.sessionIDSendback = {
              command: 'sessionID',
              payload: { value: newsessionID },
            };
            ws.send(JSON.stringify(sendsessionID));
          }
        }
      }
      this.onConnection(ws, request);
    });
    this.serverWebSocket.on('error', (error: Error) => this.onServerError(error));
    this.serverWebSocket.on('close', async () => await this.onServerClose());
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
    debug(`Connection from ${ip}, current number of connected clients is ${this.serverWebSocket.clients.size}`);
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
  public async getUserByUserId(identifier: UUID): Promise<User | undefined> {
    if (!this.isExistingUUID(identifier)) {
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
  public async getUserBysessionID(session: sessionID): Promise<User | undefined> {
    debug('sessionID inside getUserBysessionID');
    debug(session);
    const userId = this.sessionIDToUserId.get(session);
    if (userId !== undefined) {
      return await this.getUserByUserId(userId);
    }
    return undefined;
  }
  public async getUserByWebsocket(ws: IWebSocket): Promise<User | undefined> {
    let sessionID = null;
    for (const [key, value] of this.sessions.entries()) {
      // Check if the websocket is in the array of websockets associated with this session ID
      if (value.has(ws)) {
        sessionID = key;
        return await this.getUserBysessionID(sessionID);
      }
    }
    return undefined;
  }

  public getCachedUsers() {
    return new Set(Array.from(this.cachedUsers.values()));
  }
  // ______________ IS _________________
  public isExistingUUID(identifier: UUID): boolean {
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
  public cacheUser(user: User): void {
    this.uuid.add(user.getUUID());
    this.cachedUsers.set(user.getUUID(), user);
    const sessionID = user.getsessionID();
    if (sessionID !== undefined) {
      debug('sessionID inside cache user');
      debug(sessionID);
      this.sessionIDToUserId.set(sessionID, user.getUUID());
    }
  }

  public async unCacheUser(user: User): Promise<void> {
    debug('unCacheUser');
    await userSave(user);

    this.cachedUsers.delete(user.getUUID());
    const sessionID = user.getsessionID();
    if (sessionID !== undefined) {
      this.sessionIDToUserId.delete(sessionID);
    }
  }

  // ----------------------------------------------
  // CHANNELS
  // ----------------------------------------------
  public async getPublicChannelByChannelId(identifier: string): Promise<PublicChannel | undefined> {
    if (!this.isExsitingCUID(identifier)) {
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
  public async getFriendChannelByCUID(identifier: string): Promise<DirectMessageChannel | undefined> {
    if (!this.isExsitingCUID(identifier)) {
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
  public isExsitingCUID(identifier: ChannelId): boolean {
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
