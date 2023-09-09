// author: El Kaddouri Ibrahim
import { serverTerminal } from './chat-server-script.js';
import { serverLoad } from '../database/server_database.js';
import { WebSocketServer } from 'ws';
import 'https';
import fs from 'fs';
import Debug from 'debug';
const debug = Debug('main.ts');
const options = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('cert.pem'),
};
// const server = https.createServer(options).listen(8443);
// const wsServer = new WebSocketServer({ server });
const wsServer = new WebSocketServer({ port: 8443 });
const chatServer = await serverLoad(wsServer);
debug('Started chat server: current clients: %d', chatServer.serverWebsocket.clients.size);
await serverTerminal(chatServer);
//# sourceMappingURL=main.js.map