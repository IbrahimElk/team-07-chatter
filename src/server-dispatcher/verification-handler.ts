// Author: Thomas Evenpoel
// Date: 2023/04/07

import type { ChatServer } from '../server/chat-server.js';
import type * as ClientInterfaceTypes from '../protocol/client-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type { User } from '../objects/user/user.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';

export async function verificationHandler(
  verification: ClientInterfaceTypes.verification['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  // find user by websocket
  const user: User | undefined = await server.getUserByWebsocket(ws);
  if (user !== undefined) {
    user.setNgrams(new Map(verification.NgramDelta));
    user.setVerification(true);
  } else {
    sendFail(ws, 'userNotConnected');
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.verificationSendback = {
    command: 'VerificationSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}
