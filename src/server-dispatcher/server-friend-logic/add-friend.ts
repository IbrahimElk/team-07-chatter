// Author: Ibrahim El Kaddouri
// Date: 16/3/2023

import type { User } from '../../objects/user/user.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import Debug from 'debug';
const debug = Debug('add-friend.ts');
export async function addfriend(
  load: ClientInterfaceTypes.addFriend['payload'],
  chatServer: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const friend: User | undefined = await chatServer.getUserByUserId(load.friendUuid);
  //Check if a user exists with the given username
  if (friend === undefined) {
    sendFail(ws, 'nonExistingFriendname');
    return;
  }

  //Check if the current user exists

  const me: User | undefined = await chatServer.getUserByWebsocket(ws);
  if (me === undefined) {
    sendFail(ws, 'nonExistingUsername');
    return;
  }
  //Check if this user is connected
  if (!chatServer.isCachedUser(me)) {
    sendFail(ws, 'userNotConnected');
    return;
  }
  //Check if the given users are already friends
  if (me.isFriend(friend)) {
    sendFail(ws, 'usersAlreadyFriends');
    return;
  } else {
    me.addFriend(friend.getUUID());
    friend.addFriend(me.getUUID());

    const nwchannel = createChannel(me, friend);
    chatServer.setCacheFriendChannel(nwchannel);

    me.addFriendChannel(nwchannel.getCUID());
    friend.addFriendChannel(nwchannel.getCUID());
    sendSucces(ws);
    return;
  }
}
function sendFail(ws: IWebSocket, typeOfFail: string) {
  const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
    command: 'addFriendSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  console.log(addFriendAnswer);
  ws.send(JSON.stringify(addFriendAnswer));
}

function sendSucces(ws: IWebSocket) {
  const addFriendAnswer: ServerInterfaceTypes.addFriendSendback = {
    command: 'addFriendSendback',
    payload: { succeeded: true },
  };
  console.log(addFriendAnswer);
  ws.send(JSON.stringify(addFriendAnswer));
}
/**
 *
 * @param me
 * @param friend
 * @returns
 */
function createChannel(me: User, friend: User) {
  let channelName = ' ';
  const username1: string = me.getName();
  const username2: string = friend.getName();
  if (username1 < username2) {
    channelName = username1 + username2;
  } else {
    channelName = username2 + username1;
  }
  const CUID = '#' + me.getUUID() + friend.getUUID();
  return new DirectMessageChannel(channelName, me.getUUID(), friend.getUUID(), CUID);
}
