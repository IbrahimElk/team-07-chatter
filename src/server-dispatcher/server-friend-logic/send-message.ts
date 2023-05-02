import type { User } from '../../objects/user/user.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import { Message } from '../../objects/message/message.js';
import { randomUUID } from 'crypto';
import type { ChatServer } from '../../server/chat-server.js';
import type { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
import Debug from 'debug';

const debug = Debug('sendMessage.ts');

export async function sendMessage(
  user: User,
  channel: DirectMessageChannel,
  chatServer: ChatServer,
  text: string,
  date: string,
  trustLevel: number
) {
  const aLoad: ServerInterfaceTypes.messageSendbackFriend = {
    command: 'messageSendbackFriend',
    payload: {
      succeeded: true,
      text: text,
      date: date,
      sender: user.getName(),
      trustLevel: trustLevel,
    },
  };

  channel.addMessage(new Message(user, date, text, trustLevel));
  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUUID(client);
    if (clientUser !== undefined) {
      debug('clientUser.getWebSocket()?.size');
      debug(clientUser.getWebSocket()?.size);
      const clientWs = clientUser.getWebSocket(); //WORDT NOOIT GEUPDATE...
      if (clientWs !== undefined) {
        // FOR EVERT TAB OPENED
        for (const tab of clientWs) {
          debug('tab');
          debug(tab.readyState);
          tab.send(JSON.stringify(aLoad));
        }
      }
    }
  }
}
