// import type { User } from '../../objects/user/user.js';
// import type { ChatServer } from '../../server/chat-server.js';
// import { PublicChannel } from '../../objects/channel/publicchannel.js';
// import type * as ServerInterfaceTypes from '../../front-end/proto/server-types.js';
// import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
// import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
// // BIJ DE REGISTRATIE WORDT DE USER GEJOINED BIJ ALLE CHATROOMS DIE RESPECTIEVELIJK BEGOREN TOT ZIJN LESSEN.
// // DEZE VOLGENDE FUNCTIES ZIJN NIET GETEST EN LOUTER TER ILLUSTRATIE VOOR @BARTELD.

// export async function joinChannel(
//   load: ClientInterfaceTypes.joinChannel['payload'],
//   chatServer: ChatServer,
//   ws: IWebSocket
// ): Promise<void> {
//   //Check if a channel exists with this name
//   let checkPerson: User | undefined = await chatServer.getUserBySessionID(load.sessionID);
//   if (checkPerson === undefined) {
//     sendFail(ws, 'userNotConnected');
//     return;
//   }
//   joinAllChatRooms(checkPerson, load.channelCuid, chatServer);
//   const checkChannel: PublicChannel | undefined = await chatServer.getPublicChannelByChannelId(load.channelCuid);
//   if (checkChannel === undefined) {
//     return;
//   }
//   //Check if the given user is already in the given channel
//   if (checkChannel.isMemberUser(checkPerson)) {
//     return;
//   } else {
//     checkPerson.addPublicChannel(checkChannel.getCUID());
//     checkChannel.systemAddConnected(checkPerson);
//     checkChannel.addUser(checkPerson.getUUID());
//     sendSucces(ws);
//     return;
//   }
// }

// function sendSucces(ws: IWebSocket) {
//   const answer: ServerInterfaceTypes.joinChannelSendback = {
//     command: 'joinChannelSendback',
//     payload: { succeeded: true },
//   };
//   ws.send(JSON.stringify(answer));
// }

// // EXAMPLE EXPECTED JSON
// interface Lesson {
//   lessonName: string;
//   courseCode: string;
// }

// // TODO: INITIALIZE ALL POSSIBLE CHATROOMS FOR A CERTAIN USER IF IT DOESNT EXIST YET THROUGH INFORMATION IN JSON.
// // SEE chatserver.cuid for all possible existing chatrooms.

// // WE NEMEN AAN DAT DE LESSON NAMES ALLEMAAL VERSCHILLEND ZIJN EN UNIEK.
// // OF ER BESTAAT WAARSCHIJNLIJK VOOR ELKE LES
// function joinAllChatRooms(user: User, lesson: string, server: ChatServer) {
//   // FOR EACH LESSON, DOES THE RESPECTIVE CHANNEL ALREADY EXIST?
//   if (!server.cuidAlreadyInUse('#' + lesson)) {
//     // } else {
//     const nwchannel = new PublicChannel(lesson, '#' + lesson);
//     server.setCachePublicChannel(nwchannel);
//   }
//   //   }
//   // }
// }

// function sendFail(ws: IWebSocket, typeOfFail: string) {
//   const answer: ServerInterfaceTypes.joinChannelSendback = {
//     command: 'joinChannelSendback',
//     payload: { succeeded: false, typeOfFail: typeOfFail },
//   };
//   ws.send(JSON.stringify(answer));
// }
