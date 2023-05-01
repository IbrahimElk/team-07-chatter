/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */ //FIXME:
import type { User } from '../../objects/user/user.js';
import type { Channel } from '../../objects/channel/channel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { Message } from '../../objects/message/message.js';
import type { ChatServer } from '../../server/chat-server.js';
import type { PublicChannel } from '../../objects/channel/publicchannel.js';

import Debug from 'debug';
const debug = Debug('select-channel.ts');

export async function selectChannel(
  load: ClientInterfaceTypes.selectChannel['payload'],
  chatServer: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkMe: User | undefined = await chatServer.getUserBySessionID(load.sessionID);
  //Check if the user is connected
  if (checkMe === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }

  const checkChannel: PublicChannel | undefined = await chatServer.getPublicChannelByChannelId('#' + load.channelCUID);
  //Check if the friend exists
  if (checkChannel === undefined) {
    sendFail(ws, 'channelNotExisting');
    return;
  }
  if (!checkChannel.isMemberUser(checkMe)) {
    sendFail(ws, 'userNotMemberOfChannel');
    return;
  }
  checkChannel.systemAddConnected(checkMe);
<<<<<<< HEAD:src/server-dispatcher/server-channel-logic/select-channel.ts
  checkMe.setConnectedChannel(checkChannel);
  // passed all tests above.
  sendSucces(ws, checkChannel);
=======
  await sendSucces(ws, checkChannel, checkMe, chatServer);
>>>>>>> d83317e (progress bar working, PublicUser concept implemented, activeUsers working):src/server-dispatcher/server-channel-logic/connect-channel.ts
  return;
}

// TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// SEE chatserver.cuid for all possible existing chatrooms.

// WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
// function joinAllChatRooms(user: User, lesson: string, server: ChatServer) {
//   // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
//   if (!server.cuidAlreadyInUse('#' + lesson)) {
//     // } else {
//     const nwchannel = new PublicChannel(lesson, '#' + lesson);
//     server.setCachePublicChannel(nwchannel);
//     user.addPublicChannel(nwchannel.getCUID());
//     nwchannel.addUser(user.getUUID());
//   }
//   //   }
//   // }
// }

function sendFail(ws: IWebSocket, typeOfFail: string) {
  const answer: ServerInterfaceTypes.selectChannelSendback = {
    command: 'selectChannelSendback',
    payload: { succeeded: false, typeOfFail: typeOfFail },
  };
  ws.send(JSON.stringify(answer));
}

<<<<<<< HEAD:src/server-dispatcher/server-channel-logic/select-channel.ts
function sendSucces(ws: IWebSocket, channel: Channel) {
  const msgback: ServerInterfaceTypes.selectChannelSendback['payload'] = {
=======
async function sendSucces(ws: IWebSocket, channel: Channel, user: User, chatServer: ChatServer) {
  const msgback: ServerInterfaceTypes.channelInfo['payload'] = {
    connections: new Array<ClientInterfaceTypes.PublicUser>(),
>>>>>>> d83317e (progress bar working, PublicUser concept implemented, activeUsers working):src/server-dispatcher/server-channel-logic/connect-channel.ts
    messages: new Array<{
      user: ClientInterfaceTypes.PublicUser;
      text: string;
      date: string;
      trust: number;
    }>(),
  };
  const connectedUsersFromChannel = channel.getConnectedUsers();
  for (const uuid of connectedUsersFromChannel) {
    const user = await chatServer.getUserByUUID(uuid);
    if (user) msgback.connections.push(user.getPublicUser());
  }
  const messagesFromChannel: Array<Message> = channel.getMessages();
  messagesFromChannel.forEach((message) => {
    msgback.messages.push({
      date: message.getDate().toString(),
      user: user.getPublicUser(),
      text: message.getText(),
      trust: 5, //FIXME:
    });
  });
<<<<<<< HEAD:src/server-dispatcher/server-channel-logic/select-channel.ts
  const msgsendback: ServerInterfaceTypes.selectChannelSendback = {
    command: 'selectChannelSendback',
    payload: msgback,
  };
  ws.send(JSON.stringify(msgsendback));
=======

  const messageSendback: ServerInterfaceTypes.channelInfo = {
    command: 'channelInfo',
    payload: msgback,
  };
  ws.send(JSON.stringify(messageSendback));

  const answer: ServerInterfaceTypes.connectChannelSendback = {
    command: 'connectChannelSendback',
    payload: { succeeded: true, user: user.getPublicUser() },
  };

  // FOR EVERY CLIENT IN CHANNEL
  for (const client of channel.getConnectedUsers()) {
    const clientUser = await chatServer.getUserByUUID(client);
    if (clientUser === undefined) return;
    const clientWs = clientUser.getChannelWebSockets(channel);
    if (clientWs === undefined) return;
    // FOR EVERT TAB OPENED
    for (const tab of clientWs) {
      tab.send(JSON.stringify(answer));
    }
  }
>>>>>>> d83317e (progress bar working, PublicUser concept implemented, activeUsers working):src/server-dispatcher/server-channel-logic/connect-channel.ts
}
