// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientComms } from './client-dispatcher/client-dispatcher.js';
console.log('MAIN.TS');

// const socketPromise: Promise<WebSocket> = new Promise((resolve, reject) => {
const socket = new WebSocket('ws://localhost:8443');

socket.addEventListener('open', () => {
  console.log('WebSocket connection established');
  // resolve(socket);
});

socket.addEventListener('error', (err) => {
  console.error('WebSocket error:', err);
  // reject(err);
});
// });

// const socket: WebSocket = await socketPromise;
socket.addEventListener('message', (data) => {
  console.log('received: %o', data);
  ClientComms.DispatcherClient(data.data as string, socket);
});
export const wsClient = socket;
