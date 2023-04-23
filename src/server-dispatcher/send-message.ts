import type { User } from '../objects/user/user.js';
import type { Channel } from '../objects/channel/channel.js';
import type { IWebSocket } from '../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../front-end/proto/server-types.js';
import { Message } from '../objects/message/message.js';
import { randomUUID } from 'crypto';
import type { ChatServer } from '../server/chat-server.js';

export async function sendMessage(
  user: User,
  channel: Channel,
  chatServer: ChatServer,
  text: string,
  date: string,
  trustLevel: number
) {
  const aLoad: ServerInterfaceTypes.MessageSendback = {
    command: 'MessageSendback',
    payload: {
      succeeded: true,
      text: text,
      date: date,
      sender: user.getName(),
      trustLevel: trustLevel, //FIXME: change number
    },
  };

  channel.addMessage(new Message(user.getName(), date, text, '$' + randomUUID()));
  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUserId(client);
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
