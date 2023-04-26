// author: El Kaddouri Ibrahim

import { serverTerminal } from './chat-server-script.js';
import { serverLoad } from '../database/server_database.js';
import { WebSocketServer } from 'ws';
import type { ChatServer } from './chat-server.js';

import https from 'https';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('main.ts');

const options = {
  key: fs.readFileSync('key.pem'), // FIXME: should also be stored on a usb stick, or stored in database where the key is encrrypted.
  cert: fs.readFileSync('cert.pem'),
};
// const server = https.createServer(options).listen(8443);
// const wsServer = new WebSocketServer({ server });
const wsServer = new WebSocketServer({ port: 8443 });
const chatServer: ChatServer = await serverLoad(wsServer);
debug('Started chat server: current clients: %d', chatServer.getServerWebSocket().clients.size);

await serverTerminal(chatServer);
