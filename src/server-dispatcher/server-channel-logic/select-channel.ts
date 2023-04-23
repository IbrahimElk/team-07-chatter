import type { User } from '../../objects/user/user.js';
import type { Channel } from '../../objects/channel/channel.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { Message } from '../../objects/message/message.js';
import type { ChatServer } from '../../server/chat-server.js';
import { PublicChannel } from '../../objects/channel/publicchannel.js';

export async function selectChannel(
  load: ClientInterfaceTypes.selectChannel['payload'],
  chatServer: ChatServer,
  ws: IWebSocket
): Promise<void> {
  const checkMe: User | undefined = await chatServer.getUserBySessionID(load.sessionId);

  //Check if the user is connected
  if (checkMe === undefined) {
    sendFail(ws, 'userNotConnected');
    return;
  }
  joinAllChatRooms(checkMe, load.channelCuid, chatServer);

  const checkChannel: PublicChannel | undefined = await chatServer.getPublicChannelByChannelId(load.channelCuid);
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

// TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// SEE chatserver.cuid for all possible existing chatrooms.

// WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
function joinAllChatRooms(user: User, lesson: string, server: ChatServer) {
  // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
  if (!server.cuidAlreadyInUse('#' + lesson)) {
    // } else {
    const nwchannel = new PublicChannel(lesson, '#' + lesson);
    server.setCachePublicChannel(nwchannel);
  }
  //   }
  // }
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
