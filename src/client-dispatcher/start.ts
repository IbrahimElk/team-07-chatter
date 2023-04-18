import WebSocket from 'ws';

import Debug from 'debug';
import * as Client from './client-user.js';

const debug = Debug('chatter:chat-client-script');

const wsClient = new WebSocket('ws://localhost:8080/');
export const chatClient = new Client.ClientUser(wsClient);

debug('Started chat client');
