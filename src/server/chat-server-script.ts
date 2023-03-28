import { WebSocket, WebSocketServer } from 'ws';
import { ChatServer } from './chat-server.js';
import * as readline from 'node:readline/promises';

import Debug from 'debug';
import { serverLoad } from '../database/server_database.js';
import type { Server } from '../objects/server/server.js';
import { getPackedSettings } from 'node:http2';
import https from 'https';
import fs from 'fs';

const debug = Debug('chatter:chat-server-script');

/**
 * Global serverInstance
 */
export const serverInstance: Server = await serverLoad();
// debug(serverInstance);
// debug('userschashed', serverInstance.getCachedUsers()); solved
let wsServer: WebSocketServer;
let chatServer: ChatServer;
let HASRUN = false;

//from readline API
function completer(line: string) {
  const completions = '.help .exit .start'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}

export async function ServerTerminal(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer,
  });
  const answer = await rl.question('=> ');
  rl.close();
  if (answer === '.help') {
    rl.write('Commands that can be used are as follows: ');
    rl.write('\n');
    rl.write('.exit : To close the server');
    rl.write('\n');
    rl.write('.start : To start the server');
    rl.write('\n');
    rl.write('.continue : To restart the server');
    rl.write('\n');
    await ServerTerminal();
  }
  if (answer === '.exit' && HASRUN === false) {
    process.exit();
  }
  if (answer === '.exit' && HASRUN === true) {
    await chatServer.onServerClose();
    process.exit();
  }
  if (answer === '.start' && HASRUN === false) {
    HASRUN = true;
    const options = {
      key: fs.readFileSync('key.pem'), // FIXME: should also be stored on a usb stick, or stored in database where the key is encrrypted.
      cert: fs.readFileSync('cert.pem'),
    };
    const server = https.createServer(options).listen(8443);
    const wsServer = new WebSocketServer({ server });

    chatServer = new ChatServer(wsServer);
    //const test = new WebSocket('wss://127.0.0.1:8443/', {rejectUnauthorized: false});
    //console.log(wsServer.clients);
    debug('Started chat server: current clients: %d', chatServer.server.clients.size);
    await ServerTerminal();
  }
  if (answer === '.start' && HASRUN === true) {
    rl.write('Server has already been started. ');
  } else {
    rl.write('whuut, didnt understand, say one more time \n');
    await ServerTerminal();
  }
}
