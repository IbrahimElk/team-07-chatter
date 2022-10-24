import { WebSocketServer } from 'ws';
import { ChatServer } from './chat-server.js';

import Debug from 'debug';
const debug = Debug('chatter:chat-server-script');

const wsServer = new WebSocketServer({ port: 8080 });
const chatServer = new ChatServer(wsServer);

debug('Started chat server: current clients: %d', chatServer.server.clients.size);
