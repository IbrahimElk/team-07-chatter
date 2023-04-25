import { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
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
  nuser.setWebsocket(ws);
  chatserver.cachUser(nuser);

  //FIXME: Hier alle chatrooms initialiseren van de user door gebruik van functie in join-channel.ts

  sendSucces(ws, '@' + load.usernameUuid, load.usernameUuid);
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

function sendSucces(ws: IWebSocket, userid: string, username: string) {
  debug('sendSucces');

  const answer: ServerInterfaceTypes.registrationSendback = {
    command: 'registrationSendback',
    payload: { succeeded: true, usernameId: userid, username: username },
  };
  ws.send(JSON.stringify(answer));
}
