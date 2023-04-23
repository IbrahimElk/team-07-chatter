// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientComms } from './client-dispatcher/client-dispatcher.js';
console.log('MAIN.TS');

const sessionID = sessionStorage.getItem('sessionID');
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
});

socket.addEventListener('error', (err) => {
  console.error('WebSocket error:', err);
});

socket.addEventListener('message', (data) => {
  ClientComms.DispatcherClient(data.data as string, socket);
});
export const wsClient = socket;
