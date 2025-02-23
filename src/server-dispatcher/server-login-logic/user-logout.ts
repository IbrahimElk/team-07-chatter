import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-logout.ts');

export async function userLogout(
  load: ClientInterfaceTypes.logout['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await chatserver.getUserBySessionID(load.sessionID);
  //Check if a user exists with this name, otherwise a user could be created
  if (user === undefined) {
    sendFail(ws, 'nonExistingName');
    return;
  }
  const webSocketSet = user.getWebSocket();
  await chatserver.unCacheUser(user);
  for (const webSocket of webSocketSet) {
    sendSucces(webSocket);
  }
}

//These functions are marked as export for testing purposes, so aren't called anywhere else
export function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');
  const answer: ServerInterfaceTypes.logoutSendback = {
    command: 'logoutSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

export function sendSucces(ws: IWebSocket) {
  debug('sendSucces');
  const answer: ServerInterfaceTypes.logoutSendback = {
    command: 'logoutSendback',
    payload: { succeeded: true },
  };
  ws.send(JSON.stringify(answer));
}
