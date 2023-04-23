import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('user-register.ts');

export function userRegister(
  load: ClientInterfaceTypes.registration['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): void {
  //Check if a user exists with the given name
  if (chatserver.uuidAlreadyInUse('@' + load.usernameUuid)) {
    sendFail(ws, 'existingName');
    return;
  }

  //Check if the given password is long enough
  const result = checkPW(load.password);
  if (result !== 'true') {
    sendFail(ws, result);
    return;
  }
  if (load.usernameUuid.length < 1) {
    sendFail(ws, 'length of name is shorter than 1');
    return;
  }

  //Create a new user
  const nuser = new User(load.usernameUuid, load.password, '@' + load.usernameUuid);

  let sessionId = null;
  for (const [key, value] of chatserver.sessions.entries()) {
    if (value.has(ws)) {
      sessionId = key;
      nuser.setSessionID(sessionId); // MOET ALTIJD HIER KUNNEN GERAKEN WEGENS ONCONNECTION IN CHAT SERVER
    }
  }

  nuser.setWebsocket(ws);
  chatserver.cachUser(nuser);

  sendSucces(ws, '@' + load.usernameUuid);
  return;
}

function checkPW(password: string): string {
  if (password.length < 8) {
    return 'shortPW';
  }

  if (!/[A-Z]/.test(password)) {
    return 'noUppercaseInPW';
  }

  if (!/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(password)) {
    return 'noPunctuationInPW';
  }

  return 'true';
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  debug('sendFail ', typeOfFail);

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, userid: string) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true, usernameId: userid },
  };
  ws.send(JSON.stringify(answer));
}
