// import type { User } from '../objects/user/user.js';
// import type { Channel } from '../objects/channel/channel.js';
// import { serverInstance as server } from '../server/chat-server-script.js';
// import type { IWebSocket } from '../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../protocol/server-types.js';
// import type * as ClientInterfaceTypes from '../protocol/client-types.js';
// import { debug, sendPayLoad } from './server-dispatcher-functions.js';

// /**
//  * This function is called by the client-side if the user want's to leave a channel. It will check if the user or channel are undefined, if the user is
//  *   connected and if the user isn't a member of the channel. If one of these clauses fail, a leaveChannelSendBack interface will be returned to the
//  *   client-side containing a boolean succeded, which will be false, and a string: typeOfFail specifying what went wrong, so the user knows what he/she
//  *   has to do if he/she want's to leave the channel. If all the checks succeed, succeded will contain true and the user will be removed from the channel.
//  *
//  * @param load  This parameter will contain the payload (the information) of the removeChannel interface called upon by the client-side containing the username
//  *              of the user that called the function (so the one that want's leave the channel) and the channelName of the channel he/she want's to leave.
//  * @param ws This parameter is the WebSocket that is used for sending the leaveChannelSendBack interface to the client-side of the server.
//  * @returns This function will return an leaveChannelSendBack interface. If the checks above are satisfied the succeded boolean in the interface will be true.
//  *            If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong so it
//  *            can report it to the user.
//  * @author Vincent Ferrante
//  */

// export async function leaveChannel(load: ClientInterfaceTypes.leaveChannel['payload'], ws: IWebSocket): Promise<void> {
//   debug('inside leaveChannel function ');
//   //Check if a user exists with this name
//   const checkPerson: User | undefined = await server.getUser(load.username);
//   if (checkPerson === undefined) {
//     const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
//       command: 'leaveChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
//     };
//     debug('send back statement in leaveChannel function');
//     sendPayLoad(leaveChannelAnswer, ws);
//     return;
//   }
//   //Check if this user is connected
//   if (!checkPerson.isConnected()) {
//     const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
//       command: 'leaveChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'userNotConnected' },
//     };
//     debug('send back statement in leaveChannel function');
//     sendPayLoad(leaveChannelAnswer, ws);
//     return;
//   }
//   //Check if a channel exists with this name
//   const checkChannel: Channel | undefined = await server.getChannel(load.channelname);
//   if (checkChannel === undefined) {
//     const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
//       command: 'leaveChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'nonExistingChannelname' },
//     };
//     debug('send back statement in leaveChannel function');
//     sendPayLoad(leaveChannelAnswer, ws);
//     return;
//   }
//   //Check if the given user is in the channel
//   if (!(await checkChannel.getUsers()).has(checkPerson)) {
//     const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
//       command: 'leaveChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'userNotInChannel' },
//     };
//     debug('send back statement in leaveChannel function');
//     sendPayLoad(leaveChannelAnswer, ws);
//     return;
//   } else {
//     checkPerson.removeChannel(checkChannel);
//     const leaveChannelAnswer: ServerInterfaceTypes.leaveChannelSendback = {
//       command: 'leaveChannelSendback',
//       payload: { succeeded: true },
//     };
//     debug('send back statement in leaveChannel function');
//     sendPayLoad(leaveChannelAnswer, ws);
//     return;
//   }
// }
