import * as CL from './client-login.js';
import { ClientComms } from '../protocol/client-communication.js';
import WebSocket from 'ws';
import Debug from 'debug';

const debug = Debug('main: ');

const ws = new WebSocket('wss://127.0.0.1:8443/', {rejectUnauthorized: false});

ws.on('message', function (message: string) {
  debug('inside ws.on(message) statement in client-login file');
  ClientComms.DispatcherClient(message, ws);
});

await CL.startloginFunctions(ws);