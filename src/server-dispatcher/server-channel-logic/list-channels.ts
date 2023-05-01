import type { User } from '../../objects/user/user.js';
import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
import type { ChatServer } from '../../server/chat-server.js';

// export async function listChannels(chatServer: ChatServer, ws: IWebSocket): Promise<void> {
//   const user: User | undefined = await chatServer.getUserByWebsocket(ws);
//   if (user === undefined) {
//     sendFail(ws, 'userNotConnected');
//     return;
//   } else {
//     const chatRoomsList = user.getPublicChannels();
//     const stringList: Array<[string, string]> = [];
//     for (const chatRoom of chatRoomsList) {
//       const channel = await chatServer.getPublicChannelByChannelId(chatRoom);
//       if (channel !== undefined) {
//         stringList.push([channel.getName(), channel.getCUID()]); // MOET CUID TERUGGEVEN OM DIE DAN TERUG TE STUREN!
//       }
//     }
//     sendSucces(ws, stringList);
//     return;
//   }
// }
// function sendFail(ws: IWebSocket, typeOfFail: string) {
//   const answer: ServerInterfaceTypes.getListChannelSendback = {
//     command: 'getListChannelSendback',
//     payload: { succeeded: false, typeOfFail: typeOfFail },
//   };
//   ws.send(JSON.stringify(answer));
// }

// function sendSucces(ws: IWebSocket, stringList: Array<[string, string]>) {
//   const answer: ServerInterfaceTypes.getListChannelSendback = {
//     command: 'getListChannelSendback',
//     payload: { succeeded: true, list: stringList },
//   };
//   console.log(stringList);
//   ws.send(JSON.stringify(answer));
// }
