import * as CL from './client-login.js';
import { ClientComms } from '../protocol/client-communication.js';
import WebSocket from 'ws';
import Debug from 'debug';

const debug = Debug('main: ');

const ws = new WebSocket('ws://127.0.0.1:8080/');

ws.on('message', function (message: string) {
  debug('inside ws.on(message) statement in client-login file');
  ClientComms.DispatcherClient(message, ws);
});

await CL.startloginFunctions(ws);
