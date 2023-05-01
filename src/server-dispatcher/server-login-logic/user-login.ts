import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-login.ts');

export async function userLogin(
  load: ClientInterfaceTypes.logIn['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkPerson: User | undefined = await chatserver.getUserByUserId(load.usernameUUID);
  //Check if a user exists with this name, otherwise a user could be created
  if (checkPerson === undefined) {
    sendFail(ws, 'nonExistingName');
    return;
  }
  //Check if passwords match
  if (checkPerson.getPassword() !== load.password) {
    sendFail(ws, 'falsePW');
    return;
  } else {
    checkPerson.setWebsocket(ws);
    checkPerson.setSessionID(load.sessionID);
    chatserver.cachUser(checkPerson);
    sendSucces(ws, load.usernameUUID, checkPerson.getName());
    return;
  }
}
function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail');

  const answer: ServerInterfaceTypes.loginSendback = {
    command: 'loginSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, userId: string, username: string) {
  debug('sendSucces');
  console.log(userId);

  const answer: ServerInterfaceTypes.loginSendback = {
    command: 'loginSendback',
    payload: { succeeded: true, usernameId: userId, username: username },
  };
  ws.send(JSON.stringify(answer));
}
