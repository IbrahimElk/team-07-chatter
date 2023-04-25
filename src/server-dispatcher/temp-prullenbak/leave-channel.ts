// Bestaat in principe niet, Je kunt niet een les quiten vanuit client.

// EN DE SERVER GAAT ZELF GEEN CHATROOM QUITEN VAN EEN CLIENT.

// ENKEL ALS HET ZO BLIJKT UIT DE JSON VAN KULEUVENAPI DAT DE CODES EN LESSENNAMEN VERANDEREN
// EN HANGT DUS AF OF WE DAT WILLEN DOEN?

// DUS USER REQUESTS NIEUWE INFORMATIE, NIEUWE JSON, DAN ZAL HET DE CHANNELS VAN VORIGE JSON MOETEN VERLATEN,
// OFTEWEL, WANNEER JE NIEUWE JSON REQUEST, ALLE HUIDIGE CHANNELS VAN USER VERWIJDEREN.

// EN ALS EEN CHANNEL GEEN USERS MEER HEEFT, DAN VERWIJDEREN;
// IN DAT GEVAL ZOU LEAVECHANNEL EN DELETECHANNEL VAN TOEPASSING ZIJN.

// IK ZOU NIET DOEN
// EERST FUNCTIONEERENDE CLIENT EN SERVER MET HUIDIGE FUNCITES

// import type { User } from '../../objects/user/user.js';
// import type { IWebSocket } from '../../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
// import type * as ClientInterfaceTypes from '../../protocol/client-types.js';
// import type { ChatServer } from '../../server/chat-server.js';
// import type { PublicChannel } from '../../objects/channel/publicchannel.js';

// export function leaveChannel(
//   load: ClientInterfaceTypes.LeaveChannel['payload'],
//   chatServer: ChatServer,
//   ws: IWebSocket
// ): void {
//   //Check if a user exists with this name
//   const checkPerson: User | undefined = chatServer.getUserByWebsocket(ws);
//   if (checkPerson === undefined) {
//     sendFail(ws, 'nonExistingUsername');
//     return;
//   }
//   //Check if this user is connected
//   if (!chatServer.isCachedUser(checkPerson)) {
//     sendFail(ws, 'userNotConnected');
//     return;
//   }
//   //Check if a channel exists with this name
//   const checkChannel: PublicChannel | undefined = chatServer.getPublicChannelByChannelId(load.channelCUID);
//   if (checkChannel === undefined) {
//     sendFail(ws, 'nonExistingChannelname');
//     return;
//   }
//   //Check if the given user is in the channel
//   if (!checkPerson.isPartOfPublicChannel(checkChannel)) {
//     sendFail(ws, 'userNotInChannel');
//     return;
//   } else {
//     checkPerson.removePublicChannel(checkChannel);
//     sendSucces(ws);
//     return;
//   }
// }

// function sendFail(ws: IWebSocket, typeOfFail: string) {
//   const answer: ServerInterfaceTypes.LeaveChannelSendback = {
//     command: 'leaveChannelSendback',
//     payload: { succeeded: false, typeOfFail: typeOfFail },
//   };
//   ws.send(JSON.stringify(answer));
// }

// function sendSucces(ws: IWebSocket) {
//   const answer: ServerInterfaceTypes.LeaveChannelSendback = {
//     command: 'leaveChannelSendback',
//     payload: { succeeded: true },
//   };
//   ws.send(JSON.stringify(answer));
// }
