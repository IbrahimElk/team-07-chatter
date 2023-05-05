import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
import { DirectMessageChannel } from '../../objects/channel/directmessagechannel.js';

export async function removefriend(
  load: ClientInterfaceTypes.removeFriend['payload'],
  chatserver: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkMe: User | undefined = await chatserver.getUserBySessionID(load.sessionID);
  //Check if this user is connected
  if (checkMe === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }
  const checkFriend: User | undefined = await chatserver.getUserByUUID(load.friendUUID);
  //Check if a user exists with the given friendname, otherwise it could be created
  if (checkFriend === undefined) {
    sendFail(ws, 'nonExistingFriendname');
    return;
  }

  //Check if the given users aren't friends
  if (!checkMe.isFriend(checkFriend)) {
    sendFail(ws, 'usersNotFriends');
    return;
  } else {
    const friendChannelCUID = checkMe.getFriendChannelCUID(checkFriend);
    if (friendChannelCUID) {
      const friendChannel = await chatserver.getChannelByCUID(friendChannelCUID);
      if (friendChannel instanceof DirectMessageChannel) chatserver.deleteFriendChannel(friendChannel);
      checkMe.removeFriend(checkFriend);
      sendSucces(ws);
    }
    return;
  }
}

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.removeFriendSendback = {
    command: 'removeFriendSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

function sendSucces(ws: IWebSocket) {
  const answer: ServerInterfaceTypes.removeFriendSendback = {
    command: 'removeFriendSendback',
    payload: { succeeded: true },
  };
  ws.send(JSON.stringify(answer));
}

// returns the first common friend channel as a string, or undefined if there are no common friend channels.
function nameOfFriendChannel(me: User, friend: User) {
  return '#' + me.getUUID() + friend.getUUID();
}
