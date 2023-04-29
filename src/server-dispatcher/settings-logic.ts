import type { User } from '../objects/user/user.js';
import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';


import type { ChatServer } from '../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-login.ts');

export async function changeUsername(
  load: ClientInterfaceTypes.changeUsername['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkPerson: User | undefined = await chatserver.getUserByWebsocket(ws);
  //Check if a user exists with this name, otherwise a user could be created
  if (checkPerson === undefined) {
    sendFail(ws, 'nonExistingName');
    return;
  }
  checkPerson.setName(load.newUsername);
  sendSucces(ws);

}
function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');

  const answer: ServerInterfaceTypes.changeUsernameSendback = {
    command: 'changeUsernameSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.changeUsernameSendback = {
    command: 'changeUsernameSendback',
    payload: { succeeded: true },
  };
  ws.send(JSON.stringify(answer));
}

