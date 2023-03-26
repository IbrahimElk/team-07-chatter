// // @authors: Ibrahim El Kaddouri, Maité Desmedt, Vincent Ferrante
// // @date 2022-11-28

// import type { IWebSocket } from '../protocol/ws-interface.js';
// import type * as ServerInterfaceTypes from '../protocol/server-types.js';
// import Debug from 'debug';
// import WebSocket from 'ws';
// export const debug = Debug('server-dispatcher-functions: ');

// const ERROR_CODES = {
//   0: 'An incorrect message format was given.',
//   1: 'An incorrect message type / command was given.',
// };

// export function sendPayLoad(payLoad: object, webSocket: IWebSocket): void {
//   const result = JSON.stringify(payLoad);
//   if (webSocket !== undefined) {
//     if (webSocket.readyState === WebSocket.OPEN) {
//       webSocket.send(result);
//     }
//   }
//   return;
// }

// /**
//  * Server ontvangt string, wordt gedecodeert,
//  * men stelt vast dat er iets fout loopt, een verkeerde formaat, of een lege veld ...
//  * Dan zal de dispatcher deze functie oproepen met nodige errorcode.
//  * Deze functie is eigenlijk een functie in de "server",
//  * Die de error json zal terug sturen naar de client.
//  *
//  * @param STATUS_CODE number, definieert wat er is fout gelopen.
//  * @returns void
//  */
// export function callSendBackInServer(STATUS_CODE: number, ws: IWebSocket): void {
//   // wordt niet automatisch ingevuld want is error handler. (just to be safe)
//   const ListOfJsonErrorMessages1: ServerInterfaceTypes.Error[] = [];
//   debug('inside callSendBackInServer function in server-dispatcher-functions');

//   switch (STATUS_CODE) {
//     case 0:
//       ListOfJsonErrorMessages1.push({
//         command: 'ERROR',
//         payload: { Status: ERROR_CODES[0] },
//       });
//       break;
//     case 1:
//       ListOfJsonErrorMessages1.push({
//         command: 'ERROR',
//         payload: { Status: ERROR_CODES[1] },
//       });
//       break;
//   }
//   if (ListOfJsonErrorMessages1[0] !== undefined) {
//     debug('send back statement in callSendBackInServer function');
//     ws.send(JSON.stringify(ListOfJsonErrorMessages1[0]));
//   }
//   return;
// }
