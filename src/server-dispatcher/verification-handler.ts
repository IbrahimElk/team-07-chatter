// Author: Thomas Evenpoel
// Date: 2023/04/07

import type { ChatServer } from '../server/chat-server.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type { User } from '../objects/user/user.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';
import Debug from 'debug';
const debug = Debug('verification-handler.ts');

export async function verificationHandler(
  verification: ClientInterfaceTypes.verification['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await server.getUserBySessionID(verification.sessionID);
  debug('hallo');
  if (user !== undefined) {
    debug('yessir');
    if (!user.getVerification()) {
      debug('nog niet geverifieerd');
      user.setNgrams(new Map(verification.NgramDelta));
      user.setVerification(true);
    }
    sendSucces(ws);
  } else {
    sendFail(ws, 'userNotConnected');
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.verificationSendback = {
    command: 'verificationSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket) {
  const answer: ServerInterfaceTypes.verificationSendback = {
    command: 'verificationSendback',
    payload: { succeeded: true },
  };
  ws.send(JSON.stringify(answer));
}
