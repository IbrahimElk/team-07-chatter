import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import { sendMessage } from './send-message.js';
import { Detective } from '../../front-end/keystroke-fingerprinting/imposter.js';
import type { ChatServer } from '../../server/chat-server.js';

export async function channelMessageHandler(
  message: ClientInterfaceTypes.channelMessage['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await server.getUserBySessionID(message.sessionID);
  if (user !== undefined) {
    let trustLevelCalculated = 0;

    const verification: boolean = user.getVerification();
    if (verification) {
      const arr_of_other_users = new Array<Map<string, number>>();
      for (const other of server.getCachedUsers()) {
        if (other !== user) {
          arr_of_other_users.push(other.getNgrams());
        }
      }
      trustLevelCalculated = Detective(user.getNgrams(), new Map(message.NgramDelta), arr_of_other_users);
    }

    const channelCuid: string | undefined = user.getConnectedChannel();
    if (channelCuid !== undefined) {
      const channel = await server.getPublicChannelByChannelId(channelCuid);
      if (channel !== undefined) {
        await sendMessage(user, channel, server, message.text, message.date, trustLevelCalculated);
        if (trustLevelCalculated > 0.75) {
          user.bufferNgrams(new Map(message.NgramDelta));
        }
      } else {
        sendFail(ws, 'Channel Could Not Load.');
      }
    } else {
      sendFail(ws, 'User did not select a channel');
    }
  } else {
    sendFail(ws, 'user not connected');
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.messageSendbackChannel = {
    command: 'messageSendbackChannel',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}
