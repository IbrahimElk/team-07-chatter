// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientComms } from './client-dispatcher/client-dispatcher.js';
import { ClientUser } from './client-dispatcher/client-user.js';
console.log('MAIN.TS');

const socketPromise: Promise<WebSocket> = new Promise((resolve, reject) => {
  let sessionID;
  if (typeof sessionStorage !== 'undefined') {
    sessionID = sessionStorage.getItem('sessionID');
  }
  let socket: WebSocket;

  if (sessionID) {
    // Reuse existing session
    console.log('sessionID exist');
    socket = new WebSocket(new URL(`ws://localhost:8443?sessionID=${sessionID}`));
  } else {
    // Create new session
    console.log('sessionID dont exist');
    socket = new WebSocket('ws://localhost:8443');
  }

  socket.addEventListener('open', () => {
    console.log('WebSocket connection established');
    resolve(socket);
  });

  socket.addEventListener('error', (err) => {
    console.error('WebSocket error:', err);
    reject(err);
  });
});
const socket: WebSocket = await socketPromise;

socket.addEventListener('message', (data) => {
  ClientComms.DispatcherClient(data.data as string, socket);
});

export const client = new ClientUser(socket);
