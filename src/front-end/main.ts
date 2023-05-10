// Author: Ibrahim El Kaddouri
// Date: 16/3/2023
import { ClientComms } from './client-dispatcher/client-dispatcher.js';
import { ClientUser } from './client-dispatcher/client-user.js';

async function connectWithWebSocket() {
  const sessionID = sessionStorage.getItem('sessionID');
  let socket: WebSocket;

  if (sessionID !== null) {
    // Reuse existing session
    socket = new WebSocket(new URL(`ws://localhost:8443?sessionID=${sessionID}`));
  } else {
    // Create new session
    socket = new WebSocket('ws://localhost:8443');
  }

  return new Promise<WebSocket>((resolve, reject) => {
    socket.addEventListener('open', () => {
      resolve(socket);
    });

    socket.addEventListener('error', (err) => {
      alert(
        'Our servers are currently unavailable, and we are unable to establish a connection. We apologize for the inconvenience and ask that you try again later.'
      );
      reject(socket);
    });
  });
}

const socket = await connectWithWebSocket();
export const client = new ClientUser(socket, sessionStorage);

socket.addEventListener('message', (data) => {
  ClientComms.DispatcherClient(client, window, data.data as string);
});
