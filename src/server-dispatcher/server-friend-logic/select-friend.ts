import type { User } from '../../objects/user/user.js';
import type { Channel } from '../../objects/channel/channel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { Message } from '../../objects/message/message.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
const debug = Debug('select-friend.ts');

export async function selectFriend(
  load: ClientInterfaceTypes.selectFriend['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkMe: User | undefined = await chatserver.getUserBySessionID(load.sessionID);

  //Check if the user exists
  if (checkMe === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }

  const checkFriend: User | undefined = await chatserver.getUserByUUID(load.friendUUID);
  //Check if the friend exists
  if (checkFriend === undefined) {
    sendFail(ws, 'friendNotExisting');
    return;
  }
  if (!checkMe.isFriend(checkFriend)) {
    sendFail(ws, "usersAren'tFriends");
    return;
  }
  //Check if the users have a direct channel
  let chnanelid = undefined;
  checkFriend.getFriendChannels().forEach((channel1) => {
    checkMe.getFriendChannels().forEach((channel2) => {
      if (channel1 === channel2) {
        chnanelid = channel1;
      }
    });
  });
  if (chnanelid) {
    const mychannel = await chatserver.getChannelByCUID(chnanelid);
    if (mychannel instanceof DirectMessageChannel) {
      sendSucces(ws, mychannel, checkFriend);
      // checkMe.setConnectedChannel(mychannel);
      mychannel.systemAddConnected(checkMe);
      return;
    } else {
      sendFail(ws, 'noExistingDirectChannel');
      return;
    }
  } else {
    sendFail(ws, "usersAren'tFriends");
    return;
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.selectFriendSendback = {
    command: 'selectFriendSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket, channel: Channel, user: User) {
  const msgback: ServerInterfaceTypes.selectFriendSendback['payload'] = {
    succeeded: true,
    channelID: channel.getCUID(),
    user: user.getPublicUser(),
    messages: new Array<{
      sender: string;
      text: string;
      date: string;
      trust: number;
    }>(),
  };
  const messagesFromChannel: Array<Message> = channel.getMessages();
  messagesFromChannel.forEach((message) => {
    msgback.messages.push({
      date: message.getDate().toString(),
      sender: message.getUUID(),
      text: message.getText(),
      trust: message.getTrust(),
    });
  });
  const msgsendback: ServerInterfaceTypes.selectFriendSendback = {
    command: 'selectFriendSendback',
    payload: msgback,
  };
  ws.send(JSON.stringify(msgsendback));
}
