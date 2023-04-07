/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Author: Thomas Evenpoel
// Date: 2023/04/07

import type { ChatServer } from '../server/chat-server.js';
import type * as ClientInterfaceTypes from '../protocol/client-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type { User } from '../objects/user/user.js';

export async function verificationHandler(
  verification: ClientInterfaceTypes.verification['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  // find user by websocket
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const user: User | undefined = await server.getUserByWebsocket(ws);
  if (user !== undefined) {
    user.setNgrams(new Map(verification.NgramDelta));
  }
}
