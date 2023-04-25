import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-login.ts');

export async function userLogin(
  load: ClientInterfaceTypes.logIn['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkPerson: User | undefined = await chatserver.getUserByUserId(load.usernameUuid);
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
    chatserver.cachUser(checkPerson);
    sendSucces(ws, load.usernameUuid, checkPerson.getName());
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
