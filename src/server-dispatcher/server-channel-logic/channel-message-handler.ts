import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import { Detective } from '../../front-end/keystroke-fingerprinting/imposter.js';
import type { ChatServer } from '../../server/chat-server.js';
import { debug } from 'console';
import type { Channel } from '../../objects/channel/channel.js';
import { Message } from '../../objects/message/message.js';

export async function channelMessageHandler(
  message: ClientInterfaceTypes.channelMessage['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await server.getUserBySessionID(message.sessionID);
  if (user !== undefined) {
    // als het de user vindt, check of de verstuurde bericht van die user is.
    const notimposter: boolean = Detective(user.getNgrams(), new Map(message.NgramDelta), 0.48, 0.25, 0.75);
    const trustLevelCalculated = 5; // FIXME:
    const channelCUID: string | undefined = user.getConnectedChannel();
    if (channelCUID !== undefined) {
      const channel = await server.getChannelByCUID(channelCUID);
      if (channel !== undefined) {
        await sendMessage(user, channel, server, message.text, message.date, trustLevelCalculated);
      }
      // FIXME: error terugsturen als getpublicChannelByChannelId undedinfed geeft.
      if (notimposter) {
        user.setNgrams(new Map(message.NgramDelta));
      }
    } else {
      const messageSendbackResponse: ServerInterfaceTypes.messageSendbackChannel = {
        command: 'messageSendbackChannel',
        payload: { succeeded: false, typeOfFail: 'Channel not connected.' },
      };
      ws.send(JSON.stringify(messageSendbackResponse));
    }
  } else {
    const messageSendbackResponse: ServerInterfaceTypes.messageSendbackChannel = {
      command: 'messageSendbackChannel',
      payload: { succeeded: false, typeOfFail: 'user not connected' },
    };
    ws.send(JSON.stringify(messageSendbackResponse));
  }
}

async function sendMessage(
  user: User,
  channel: Channel,
  chatServer: ChatServer,
  text: string,
  date: string,
  trustLevel: number
) {
  const aLoad: ServerInterfaceTypes.messageSendbackChannel = {
    command: 'messageSendbackChannel',
    payload: {
      succeeded: true,
      text: text,
      date: date,
      sender: user.getName(),
      trustLevel: trustLevel,
    },
  };

  channel.addMessage(new Message(user.getName(), date, text));
  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUUID(client);
    if (clientUser !== undefined) {
      const clientWs = clientUser.getWebSocket();
      if (clientWs !== undefined) {
        // FOR EVERT TAB OPENED
        for (const tab of clientWs) {
          tab.send(JSON.stringify(aLoad));
        }
      }
    }
  }
}
