// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import { ClientComms } from './client-dispatcher/client-dispatcher.js';
console.log('MAIN.TS');

export const wsClient = new WebSocket('ws://localhost:8443/');
wsClient.addEventListener('open', () => {
  console.log('connected...');
});

wsClient.addEventListener('message', (data) => {
  console.log('received: %o', data);
  ClientComms.DispatcherClient(data.data as string, wsClient);
});
wsClient.addEventListener('error', (err) => {
  console.error('WebSocket error:', err);
});
