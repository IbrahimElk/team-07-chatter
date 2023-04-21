import type { User } from '../../objects/user/user.js';
import type { Channel } from '../../objects/channel/channel.js';
import type { IWebSocket } from '../../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
import type { Message } from '../../objects/message/message.js';
import type { ChatServer } from '../../server/chat-server.js';
import type { PublicChannel } from '../../objects/channel/publicchannel.js';

export async function selectChannel(
  load: ClientInterfaceTypes.selectChannel['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkMe: User | undefined = await chatserver.getUserByWebsocket(ws);

  //Check if the user is connected
  if (checkMe === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }
  const checkChannel: PublicChannel | undefined = await chatserver.getPublicChannelByChannelId(load.channelCuid);
  //Check if the friend exists
  if (checkChannel === undefined) {
    sendFail(ws, 'channelNotExisting');
    return;
  }
  if (!checkChannel.isMemberUser(checkMe)) {
    sendFail(ws, 'userNotMemberOfChannel');
    return;
  }
  // passed all tests above.
  sendSucces(ws, checkChannel);
  return;
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.selectChannelSendback = {
    command: 'selectChannelSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, channel: Channel) {
  const msgback: ServerInterfaceTypes.selectChannelSendback['payload'] = {
    messages: new Array<{
      sender: string;
      text: string;
      date: string;
      trust: number;
    }>(),
    succeeded: true,
  };
  const messagesFromChannel: Array<Message> = channel.getMessages();
  messagesFromChannel.forEach((message) => {
    msgback.messages.push({
      date: message.getDate().toString(),
      sender: message.getUserName(),
      text: message.getText(),
      trust: 5, //FIXME:
    });
  });
  const msgsendback: ServerInterfaceTypes.selectChannelSendback = {
    command: 'selectChannelSendback',
    payload: msgback,
  };
  ws.send(JSON.stringify(msgsendback));
}
