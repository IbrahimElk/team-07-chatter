import WebSocket from 'ws';
import Debug from 'debug';
import { ClientComms } from '../protocol/client-communication.js';
import { ClientUser } from './client-user.js';
const debug = Debug('chat-client: ');
import * as CL from './client-login.js';
import { emitKeypressEvents } from 'node:readline';

export const CLuser = new ClientUser();
emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
debug('ON');
process.stdin.on('keypress', CLuser.keypresscb);

export const ws = new WebSocket('ws://127.0.0.1:8080/');

ws.on('message', function (message: string) {
  debug('inside ws.on(message) statement in client-login file');
  ClientComms.DispatcherClient(message);
});

await CL.startloginFunctions();
