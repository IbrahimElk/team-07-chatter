import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type { ChatServer } from '../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-login.ts');

export async function validateSession(
  load: ClientInterfaceTypes.validateSession['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const check = await chatserver.getUserBysessionID(load.sessionID);
  //Check if the given sessionID is valid
  if (check === undefined) {
    sendFail(ws, 'nontConnected');
    return;
  } else {
    sendSucces(ws);
    return;
  }
}
function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');

  const answer: ServerInterfaceTypes.validateSessionSendback = {
    command: 'validateSessionSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.validateSessionSendback = {
    command: 'validateSessionSendback',
    payload: { succeeded: true },
  };
  ws.send(JSON.stringify(answer));
}
