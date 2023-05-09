import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import { Detective } from '../../front-end/keystroke-fingerprinting/imposter.js';
import type { ChatServer } from '../../server/chat-server.js';
import type { Channel } from '../../objects/channel/channel.js';
import { Message } from '../../objects/message/message.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

export async function channelMessage(
  message: ClientInterfaceTypes.channelMessage['payload'],
  server: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const user: User | undefined = await server.getUserBySessionID(message.sessionID);
  if (user === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }
  const channel = await server.getChannelByCUID(message.channelCUID);
  if (channel === undefined) {
    sendFail(ws, 'nonExistingChannel');
    return;
  }
  if (!user.isConnectedToChannel(channel)) {
    sendFail(ws, 'notConnectedToChannel');
    return;
  }
  let trustLevelCalculated = 0;
  const verification: boolean = user.getVerification();
  if (message.NgramDelta.length === 0 || message.NgramDelta.at(0)?.[0].length === 1) {
    trustLevelCalculated = user.getLastTrustLevel();
  } else if (verification) {
    const arr_of_other_users = new Array<Map<string, number>>();
    for (const other of await server.getUsersForKeystrokes()) {
      if (other !== user) {
        arr_of_other_users.push(other.getNgrams());
      }
    }
    trustLevelCalculated = Detective(user.getNgrams(), new Map(message.NgramDelta), arr_of_other_users);
    user.setLastTrustLevel(trustLevelCalculated);
  }

  await sendMessage(user, channel, server, message.text, message.date, trustLevelCalculated);
  if (trustLevelCalculated > 0.75) {
    user.bufferNgrams(new Map<string, number>(message.NgramDelta));
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
  const notificationLoad: ServerInterfaceTypes.messageSendbackChannel = {
    command: 'messageSendbackChannel',
    payload: {
      succeeded: true,
      text: text,
      date: date,
      user: user.getPublicUser(),
      trustLevel: trustLevel,
      isNotification: true,
    },
  };

  const messageLoad: ServerInterfaceTypes.messageSendbackChannel = {
    command: 'messageSendbackChannel',
    payload: {
      succeeded: true,
      text: text,
      date: date,
      user: user.getPublicUser(),
      trustLevel: trustLevel,
      isNotification: false,
    },
  };

  channel.addMessage(new Message(user, date, text, trustLevel));

  //SEND EITHER WAY FOR EACH DIRECT MESSAG CHANNEL
  if (channel instanceof DirectMessageChannel) {
    for (const client of channel.getUsers()) {
      console.log(client);
      const clientUser = await chatServer.getUserByUUID(client);
      if (clientUser === undefined) return;
      const clientChannelWs = clientUser.getChannelWebSockets(channel);
      const clientWs = clientUser.getWebSocket();
      if (clientWs === undefined) return;
      console.log('channelws', clientChannelWs.size);
      console.log('allws', clientWs.size);
      const clientNonChannelWs = new Set<IWebSocket>();
      for (const ws of clientWs) {
        if (clientChannelWs.has(ws)) {
          for (const channelWs of clientChannelWs) {
            if (channelWs === ws) console.log('same');
          }
        } else clientNonChannelWs.add(ws);
      }
      console.log('intersect', clientNonChannelWs.size);
      // FOR EVERT TAB in channel
      for (const tab of clientChannelWs) {
        tab.send(JSON.stringify(messageLoad));
      }
      //for every tab not in channel
      for (const tab of clientNonChannelWs) {
        console.log('notication');
        tab.send(JSON.stringify(notificationLoad));
      }
    }
    return;
  }

  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUUID(client);
    if (clientUser === undefined) {
      console.log('clientuser error');
      return;
    }
    const clientWs = clientUser.getChannelWebSockets(channel);
    if (clientWs.size === 0) {
      console.log('client ws error');
      return;
    }
    // FOR EVERT TAB OPENED
    for (const tab of clientWs) {
      console.log('verstuur nr client');
      console.log(JSON.stringify(messageLoad));
      tab.send(JSON.stringify(messageLoad));
    }
  }
}
