// author: Dirk Nuyens
// date: 2022-10-24

import type { WebSocket, RawData } from 'ws';
import type { IncomingMessage, Server } from 'node:http';
import type { ChannelId, ChannelName, Message } from '../protocol/proto.js';
import type { IWebSocket, IWebSocketServer } from '../protocol/ws-interface.js';

// import { register } from './server-dispatcher-functions.js';
import Debug from 'debug';
import { ServerComms } from '../protocol/server-communication.js';
import { serverSave } from '../database/server_database.js';
import { serverInstance as server } from '../chat-server/chat-server-script.js';
import type { User } from '../user/user.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const debug = Debug('chatter:ChatServer');

export class ChatServer {
  started = false;
  ended: Promise<void>;
  server: IWebSocketServer;
  channels = new Map<ChannelId, ChannelName>();

  constructor(server: IWebSocketServer, start = true) {
    this.server = server;
    if (start) this.start();
    this.ended = new Promise<void>((resolve, _reject) => {
      this.server.on('close', () => resolve);
    });
  }

  start() {
    if (this.started) return;
    this.server.on('connection', (ws: IWebSocket, request: IncomingMessage | string | undefined) =>
      this.onConnection(ws, request)
    );
    this.server.on('error', (error: Error) => this.onServerError(error));
    this.server.on('close', () => this.onServerClose());
    this.started = true;
  }

  onServerError(error: Error) {
    debug('WebSocketServer error: %o', error);
  }

  onServerClose() {
    serverSave(server);
    debug('WebSocketServer closed');
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
    ws.on('message', (data: RawData, isBinary: boolean) => this.onClientRawMessage(ws, data, isBinary));
    ws.on('close', (code: number, reason: Buffer) => this.onClientClose(code, reason, ws));
  }

  onClientRawMessage(ws: IWebSocket, data: RawData, _isBinary: boolean) {
    debug('Received raw message %o', data);
    const msg: string = data.toString();
    debug('inside chat-server.ts onClientRawMessage()');
    ServerComms.DispatcherServer(msg, ws);
  }

  // onClientMessage(ws: IWebSocket, msg: Message) {
  //   debug('Received message %o', msg);
  //   // Let's send this message to all connected clients for now (including ourselves):
  //   for (const client of this.server.clients) {
  //     if (client.readyState === WebSocket.OPEN) {
  //       // client.send(msg.msg);
  //       // ServerComms.DispatcherServer(msg.msg, client);
  //     }
  //   }
  // }

  onClientClose(code: number, reason: Buffer, ws: IWebSocket) {
    const user: User | undefined = server.systemGetUserFromWebSocket(ws);
    const testuser = user;
    if (testuser !== undefined) {
      server.systemDisconnectUser(testuser);
    }
    debug('Client closed connection: %d: %s', code, reason.toString());
    server.printConnectedUsers();
    server.printUsers();
  }
}
