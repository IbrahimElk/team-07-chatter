// import type { User } from '../objects/user/user.js';
// import type { Channel } from '../objects/channel/channel.js';
// import { serverInstance as server } from '../server/chat-server-script.js';
// import type { IWebSocket } from '../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../protocol/server-types.js';
// import type * as ClientInterfaceTypes from '../protocol/client-types.js';
// import { debug, sendPayLoad } from './server-dispatcher-functions.js';

// /**
//  * This function is called by the client-side if the user want's to join a channel. It will check if the user or channel are undefined, if the user is
//  *   connected and if the user already is a member of the channel. If one of these clauses fail, a joinChannelSendBack interface will be returned to the
//  *   client-side containing a boolean succeded, which will be false, and a string: typeOfFail specifying what went wrong, so the user knows what he/she
//  *   has to do if he/she want's to join the channel. If all the checks succeed, succeded will contain true and the user will be added to the channel.
//  *
//  * @param load  This parameter will contain the payload (the information) of the joinChannel interface called upon by the client-side containing the username
//  *              of the user that called the function (so the one that want's to join the channel) and the channelName of the channel he/she want's to join.
//  * @param ws This parameter is the WebSocket that is used for sending the joinChannelSendBack interface to the client-side of the server.
//  * @returns This function will return an joinChannelSendBack interface. If the checks above are satisfied the succeded boolean in the interface will be true.
//  *            If this isn't the case this boolean will be false and the typeOfFail will contain the string telling the client-side what went wrong so it
//  *            can report it to the user.
//  * @author Vincent Ferrante
//  */

// export async function joinChannel(load: ClientInterfaceTypes.joinChannel['payload'], ws: IWebSocket): Promise<void> {
//   debug('inside joinChannel function ');
//   //Check if a user exists with this name
//   const checkPerson: User | undefined = await server.getUser(load.username);
//   if (checkPerson === undefined) {
//     const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
//       command: 'joinChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'nonExistingUsername' },
//     };
//     debug('send back statement in joinChannel function');
//     sendPayLoad(joinChannelAnswer, ws);
//     return;
//   }
//   //Check if the given user is connected
//   if (!checkPerson.isConnected()) {
//     const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
//       command: 'joinChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'userNotConnected' },
//     };
//     debug('send back statement in joinChannel function');
//     sendPayLoad(joinChannelAnswer, ws);
//     return;
//   }
//   //Check if a channel exists with this name
//   const checkChannel: Channel | undefined = await server.getChannel(load.channelname);
//   if (checkChannel === undefined) {
//     const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
//       command: 'joinChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'nonExistingChannelname' },
//     };
//     debug('send back statement in joinChannel function');
//     sendPayLoad(joinChannelAnswer, ws);
//     return;
//   }
//   //Check if the given user is already in the given channel
//   if ((await checkChannel.getUsers()).has(checkPerson)) {
//     const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
//       command: 'joinChannelSendback',
//       payload: { succeeded: false, typeOfFail: 'userInChannel' },
//     };
//     debug('send back statement in joinChannel function');
//     sendPayLoad(joinChannelAnswer, ws);
//     return;
//   } else {
//     checkPerson.addChannel(checkChannel);
//     const joinChannelAnswer: ServerInterfaceTypes.joinChannelSendback = {
//       command: 'joinChannelSendback',
//       payload: { succeeded: true },
//     };
//     debug('send back statement in joinChannel function');
//     sendPayLoad(joinChannelAnswer, ws);
//     return;
//   }
// }
