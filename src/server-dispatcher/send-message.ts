import type { User } from '../objects/user/user.js';
import type { Channel } from '../objects/channel/channel.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
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
  for (const client of channel.getUsers()) {
    const clientUser = await chatServer.getUserByUserId(client);
    if (clientUser !== undefined) {
      const clientWs = clientUser.getWebSocket();
      if (clientWs !== undefined) {
        clientWs.send(JSON.stringify(aLoad));
      }
    }
  }
}
