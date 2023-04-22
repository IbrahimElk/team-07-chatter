// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientComms } from './client-dispatcher/client-dispatcher.js';
import { ClientUser } from './client-dispatcher/client-user.js';
console.log('MAIN.TS');

const sessionID = ClientUser.getCookie('sessionID', document);
let socket;

if (sessionID) {
  // Reuse existing session
  console.log('cookie exist');
  socket = new WebSocket(new URL(`ws://localhost:8443?sessionID=${sessionID}`));
} else {
  //   // Create new session
  console.log('cookie dont exist');
  socket = new WebSocket('ws://localhost:8443');
}

export const wsClient = socket;

wsClient.addEventListener('open', (data) => {
  console.log('connected...');
});

wsClient.addEventListener('message', (data) => {
  console.log('received: %o', data);
  ClientComms.DispatcherClient(data.data as string, wsClient);
});
wsClient.addEventListener('error', (err) => {
  console.error('WebSocket error:', err);
});
