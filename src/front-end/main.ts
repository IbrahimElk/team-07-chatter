// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { ClientComms } from './client-dispatcher/client-dispatcher.js';
import { ClientUser } from './client-dispatcher/client-user.js';

console.log('MAIN.TS');

async function connectWithWebSocket() {
  const sessionID = sessionStorage.getItem('sessionID');
  let socket: WebSocket;

  if (sessionID !== null) {
    // Reuse existing session
    console.log('sessionID exists');
    socket = new WebSocket(new URL(`ws://localhost:8443?sessionID=${sessionID}`));
  } else {
    // Create new session
    console.log('sessionID does not exist');
    socket = new WebSocket('ws://localhost:8443');
  }

  return new Promise<WebSocket>((resolve, reject) => {
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established');
      resolve(socket);
    });

    socket.addEventListener('error', (err) => {
      alert(
        'Our servers are currently unavailable, and we are unable to establish a connection. We apologize for the inconvenience and ask that you try again later.'
      );
      console.error('WebSocket error:', err);
      reject(socket);
    });
  });
}

const socket = await connectWithWebSocket();
socket.addEventListener('message', (data) => {
  ClientComms.DispatcherClient(data.data as string);
});
export const client = new ClientUser(socket);
