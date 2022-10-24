import { WebSocketServer, WebSocket, RawData } from 'ws';
import type { IncomingMessage } from 'node:http';
import type { ChannelId, ChannelName, Message } from '../protocol/proto.js';

import Debug from 'debug';
const debug = Debug('chatter:ChatServer');

export class ChatServer {
  started = false;
  ended: Promise<void>;
  server: WebSocketServer;
  channels = new Map<ChannelId, ChannelName>();

  constructor(server: WebSocketServer, start = true) {
    this.server = server;
    if (start) this.start();
    this.ended = new Promise<void>((resolve, _reject) => {
      this.server.on('close', () => resolve);
    });
  }

  start() {
    if (this.started) return;
    this.server.on('connection', (ws: WebSocket, request: IncomingMessage) => this.onConnection(ws, request));
    this.server.on('error', (error: Error) => this.onServerError(error));
    this.server.on('close', () => this.onServerClose());
    this.started = true;
  }

  onServerError(error: Error) {
    debug('WebSocketServer error: %o', error);
  }

  onServerClose() {
    debug('WebSocketServer closed');
  }

  /**
   * Install listeners when a new client connects.
   * @param ws The WebSocket of the new client.
   * @param request
   */
  onConnection(ws: WebSocket, request: IncomingMessage) {
    const ip = request?.socket?.remoteAddress ?? '{unknown IP}';
    debug(`Connection from ${ip}, current number of connected clients is ${this.server.clients.size}`);
    // Now install a listener for messages from this client:
    ws.on('message', (data: RawData, isBinary: boolean) => this.onClientRawMessage(ws, data, isBinary));
    ws.on('close', (code: number, reason: Buffer) => this.onClientClose(code, reason));
  }

  onClientRawMessage(ws: WebSocket, data: RawData, _isBinary: boolean) {
    debug('Received raw message %o', data);
    // Now do something (parse the message and act accordingly).
    // Assume the message is just a text string for now:
    const msg = data.toString();
    this.onClientMessage(ws, { msg });
  }

  onClientMessage(ws: WebSocket, msg: Message) {
    debug('Received message %o', msg);
    // Let's send this message to all connected clients for now (including ourselves):
    for (const client of this.server.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.msg);
      }
    }
  }

  onClientClose(code: number, reason: Buffer) {
    debug('Client closed connection: %d: %s', code, reason.toString());
  }
}
