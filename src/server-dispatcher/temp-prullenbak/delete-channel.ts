// BESTAAT IN PRINCIPE NIET. EEN CLIENT GAAT NIET EEN CHANNEL KUNNNE VERWIJDEREN.
// EN DE SERVER GAAT ZELF GEEN CHATROOM LESSEN VERWIJDEREN.

// ENKEL ALS HET ZO BLIJKT UIT DE JSON VAN KULEUVENAPI DAT DE CODES EN LESSENNAMEN VERANDEREN
// EN HANGT DUS AF OF WE DAT WILLEN DOEN?

// DUS USER REQUESTS NIEUWE INFORMATIE, NIEUWE JSON, DAN ZAL HET DE CHANNELS VAN VORIGE JSON MOETEN VERLATEN,
// OFTEWEL, WANNEER JE NIEUWE JSON REQUEST, ALLE HUIDIGE CHANNELS VAN USER VERWIJDEREN.

// EN ALS EEN CHANNEL GEEN USERS MEER HEEFT, DAN VERWIJDEREN;
// IN DAT GEVAL ZOU LEAVECHANNEL EN DELETECHANNEL VAN TOEPASSING ZIJN.

// IK ZOU NIET DOEN
// EERST FUNCTIONEERENDE CLIENT EN SERVER MET HUIDIGE FUNCITES

// import type { IWebSocket } from '../../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../../protocol/server-types.js';
// import type { ChatServer } from '../../server/chat-server.js';
// import type { PublicChannel } from '../../objects/channel/publicchannel.js';

// export function deleteChannel(channelId: string, chatServer: ChatServer, ws: IWebSocket): void {
//   const channel: PublicChannel | undefined = chatServer.getPublicChannelByChannelId(channelId);
//   if (channel === undefined) {
//     const answer: ServerInterfaceTypes.DeleteChannelSendback = {
//       command: 'deleteChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'nonexisting channel' },
//     };
//     ws.send(JSON.stringify(answer));
//     return;
//   } else {
//     const usersOfThisChannel = channel.getUsers();
//     // FIXME: zorg ervoor dat je getChannelByChannelid voor public en voor vrienden.
//     usersOfThisChannel.forEach((user) => user.removePublicChannel(channel));
//     chatServer.deletePublicChannel(channel);
//     const answer: ServerInterfaceTypes.DeleteChannelSendback = {
//       command: 'deleteChannelSendback',
//       payload: { succeeded: true },
//     };
//     ws.send(JSON.stringify(answer));
//     return;
//   }
// }
