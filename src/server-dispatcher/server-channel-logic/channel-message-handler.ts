import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import { Detective } from '../../front-end/keystroke-fingerprinting/imposter.js';
import type { ChatServer } from '../../server/chat-server.js';
import type { Channel } from '../../objects/channel/channel.js';
import { Message } from '../../objects/message/message.js';

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
    const channel = await server.getChannelByCUID('#' + message.channelName);
    if (channel === undefined) {
      sendFail(ws, 'nonExistingChannel');
      return;
    }
    if (!user.isConnectedToChannel(channel)) {
      sendFail(ws, 'notConnectedToChannel');
      return;
    }
    await sendMessage(user, channel, server, message.text, message.date, trustLevelCalculated);
    if (trustLevelCalculated > 0.75) {
      user.bufferNgrams(new Map(message.NgramDelta));
    }
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.messageSendbackChannel = {
    command: 'messageSendbackChannel',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
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
      user: user.getPublicUser(),
      trustLevel: trustLevel,
    },
  };

  channel.addMessage(new Message(user.getUUID(), date, text, trustLevel));
  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUUID(client);
    if (clientUser === undefined) return;
    const clientWs = clientUser.getChannelWebSockets(channel);
    if (clientWs === undefined) return;
    // FOR EVERT TAB OPENED
    for (const tab of clientWs) {
      tab.send(JSON.stringify(aLoad));
    }
  }
}
