// // author: Dirk Nuyens
// // date: 2022-10-24

// import type { WebSocket, RawData } from 'ws';
// import type { IncomingMessage, Server } from 'node:http';
// import type { ChannelId, ChannelName, Message } from '../protocol/protocol-interface.js';
// import type { IWebSocket, IWebSocketServer } from '../protocol/ws-interface.js';

// // import { register } from './server-dispatcher-functions.js';
// import Debug from 'debug';
// import { ServerComms } from '../protocol/server-communication.js';
// import { serverSave } from '../database/server_database.js';
// import { serverInstance as server } from './chat-server-script.js';
// import type { User } from '../objects/user/user.js';

// const debug = Debug('chatter:ChatServer');

// export class ChatServer {
//   started = false;
//   // ended: Promise<void>;
//   server: IWebSocketServer;
//   channels = new Map<ChannelId, ChannelName>();

//   constructor(server: IWebSocketServer, start = true) {
//     this.server = server;
//     if (start) this.start();
//     // this.ended = new Promise<void>((resolve) => {
//     //   this.server.on('close', () => resolve);
//     // });
//   }

//   start() {
//     if (this.started) return;
//     this.server.on('connection', (ws: IWebSocket, request: IncomingMessage | string | undefined) =>
//       this.onConnection(ws, request)
//     );
//     this.server.on('error', (error: Error) => this.onServerError(error));
//     this.server.on('close', async () => await this.onServerClose());

//     this.started = true;
//   }

//   onServerError(error: Error) {
//     debug('WebSocketServer error: %o', error);
//   }

//   async onServerClose() {
//     await serverSave(server);
//     debug('WebSocketServer closed');
//   }

//   /**
//    * Install listeners when a new client connects.
//    * @param ws The WebSocket of the new client.
//    * @param request
//    */
//   onConnection(ws: IWebSocket, request: IncomingMessage | string | undefined) {
//     const ip = typeof request === 'string' ? request : request?.socket?.remoteAddress ?? '{unknown IP}';
//     debug(`Connection from ${ip}, current number of connected clients is ${this.server.clients.size}`);
//     // Now install a listener for messages from this client:
//     ws.on('message', (data: RawData, isBinary: boolean) => this.onClientRawMessage(ws, data, isBinary));
//     ws.on('close', (code: number, reason: Buffer) => this.onClientClose(code, reason, ws));
//   }

//   async onClientRawMessage(ws: IWebSocket, data: RawData, _isBinary: boolean) {
//     debug('Received raw message %o', data);
//     const msg: string = data.toString();
//     debug('inside chat-server.ts onClientRawMessage()');
//     await ServerComms.DispatcherServer(msg, ws);
//   }

//   // onClientMessage(ws: IWebSocket, msg: Message) {
//   //   debug('Received message %o', msg);
//   //   // Let's send this message to all connected clients for now (including ourselves):
//   //   for (const client of this.server.clients) {
//   //     if (client.readyState === WebSocket.OPEN) {
//   //       // client.send(msg.msg);
//   //       // ServerComms.DispatcherServer(msg.msg, client);
//   //     }
//   //   }
//   // }

//   async onClientClose(code: number, reason: Buffer, ws: IWebSocket) {
//     const user: User | undefined = await server.getUserByWebsocket(ws);
//     const testuser = user;
//     if (testuser !== undefined) {
//       await server.disconnectUser(testuser);
//     }
//     debug('Client closed connection: %d: %s', code, reason.toString());
//   }
// }
// function resolve(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void): void {
//   throw new Error('Function not implemented.');
// }
