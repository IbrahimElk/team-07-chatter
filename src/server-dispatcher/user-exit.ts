// import { serverInstance as server } from '../server/chat-server-script.js';
// import type { IWebSocket } from '../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../protocol/server-types.js';
// import type * as ClientInterfaceTypes from '../protocol/client-types.js';
// import { debug, sendPayLoad } from './server-dispatcher-functions.js';

// export async function userExit(load: ClientInterfaceTypes.exitMe['payload'], ws: IWebSocket): Promise<void> {
//   debug(`inside exit function for person with name ${load.name}`);
//   const checkPerson = await server.getUser(load.name);
//   if (checkPerson === undefined) {
//     const loginAnswer: ServerInterfaceTypes.exitMeSendback = {
//       command: 'exitMeSendback',
//       payload: { succeeded: false, typeOfFail: 'userNotConnected' },
//     };
//     sendPayLoad(loginAnswer, ws);
//     return;
//   }
//   if (checkPerson.isConnected()) {
//     await server.disconnectUser(checkPerson);
//     const exitAnswer: ServerInterfaceTypes.exitMeSendback = {
//       command: 'exitMeSendback',
//       payload: { succeeded: true },
//     };
//     sendPayLoad(exitAnswer, ws);
//     return;
//   }
// }
