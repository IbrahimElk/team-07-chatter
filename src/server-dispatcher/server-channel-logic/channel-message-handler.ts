import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
import { sendMessage } from '../send-message.js';
import { Detective } from '../../front-end/keystroke-fingerprinting/imposter.js';
import type { ChatServer } from '../../server/chat-server.js';

export async function channelMessageHandler(
  message: ClientInterfaceTypes.channelMessage['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  // vind de verstuurder aan de hand van de websocket
  const user: User | undefined = await server.getUserByWebsocket(ws);
  if (user !== undefined) {
    // als het de user vindt, check of de verstuurde bericht van die user is.
    const notimposter: boolean = Detective(user.getNgrams(), new Map(message.NgramDelta), 0.48, 0.25, 0.75);
    const trustLevelCalculated = 5; // FIXME:
    const channelCuid: string | undefined = user.getConnectedChannel();
    if (channelCuid !== undefined) {
      const channel = await server.getPublicChannelByChannelId(channelCuid);
      if (channel !== undefined) {
        await sendMessage(user, channel, server, message.text, message.date, trustLevelCalculated);
      }
      // FIXME: error terugsturen als getpublicChannelByChannelId undedinfed geeft.
      if (notimposter) {
        user.setNgrams(new Map(message.NgramDelta));
      }
    } else {
      const messageSendbackResponse: ServerInterfaceTypes.MessageSendback = {
        command: 'MessageSendback',
        payload: { succeeded: false, typeOfFail: 'Channel not connected.' },
      };
      ws.send(JSON.stringify(messageSendbackResponse));
    }
  } else {
    const messageSendbackResponse: ServerInterfaceTypes.MessageSendback = {
      command: 'MessageSendback',
      payload: { succeeded: false, typeOfFail: 'user not connected' },
    };
    ws.send(JSON.stringify(messageSendbackResponse));
  }
}
