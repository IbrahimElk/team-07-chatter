// Author: John Gao
// Date: 12/12/2022
// import { describe, expect, it, vi } from 'vitest';
// import * as readlineN from 'node:readline/promises';
// import { startinterfaces } from '../chat-client/client-interfaces.js';
// import { ClientUser } from '../chat-client/client-user.js';
// import { MockWebSocket, MockWebSocketServer } from '../protocol/__mock__/ws-mock.js';
// import type * as ClientInteraceTypes from '../protocol/protocol-types-client.js';
// import { promptUserInput } from '../chat-client/chat-timing.js';
// import * as CC from '../chat-client/chat-client.js';
// import type { IWebSocket } from '../protocol/ws-interface.js';
// import { object } from 'zod';
// import WebSocket from 'ws';
// import * as KEY from '../keystroke-fingerprinting/imposter.js';

// const CLuser = new ClientUser();
// //const ws = new WebSocket('ws://127.0.0.1:8080/');

// export const object1 = {
//   func: startinterfaces,
// };
// export const object2 = {
//   func: chatFunctiontest,
// };
// export const object3 = {
//   func: promptUserInputtest,
// };

// type PromptUserReturntype = {
//   text: string;
//   timings: Map<string, number>;
// };

// /* *
//  * A test version of selectFriend
//  * This function uses an await to wait on user input to store in constant answer.
//  * This isn't done with the original function, because the async version would lead to problems with other functions of the chatter.
//  * This is solely done to improve unit testing, the contents of the original and test version are practically the same.
//  */

// export async function selectFriendtest(rll: readlineN.Interface, ws: IWebSocket): Promise<void> {
//   const answer = await rll.question('Friendname: ');
//   if (answer === '.exit') {
//     rll.pause();
//     object1.func();
//   } else {
//     const friendName: string = answer;
//     const selectfriend: ClientInteraceTypes.selectFriend = {
//       command: 'SelectFriend',
//       payload: { friendname: friendName, username: CLuser.getName() },
//     };
//     CLuser.setFriendName(friendName);
//     ws.send(JSON.stringify(selectfriend));
//     rll.pause();
//   }
// }

// export async function chatFunctiontest(rll: readlineN.Interface, ws: IWebSocket): Promise<void> {
//   //const //answer = await rll.question('Friendname: ');
//   CLuser.setChatModus(true, CLuser.getFriendName());
//   const answer: PromptUserReturntype = await object3.func(rll, '>: ');
//   if (answer.text === '.exit') {
//     rll.pause();
//     object1.func();
//     CLuser.setChatModus(false, CLuser.getFriendName());
//     return;
//   }
//   const usermessage: ClientInteraceTypes.friendMessage = {
//     command: 'friendMessage',
//     payload: {
//       date: new Date()
//         .toISOString()
//         .replace(/T/, ' ') // replace T with a space
//         .replace(/\..+/, ''), // delete the dot and everything after,,
//       text: answer.text,
//       NgramDelta: Object.fromEntries(answer.timings),
//     },
//   };
//   ws.send(JSON.stringify(usermessage));
//   rll.pause();
//   await object2.func(rll, ws);
// }

// export function getListtest(friendsOrRespectivelyChannel: 0 | 1, ws: IWebSocket) {
//   let list: ClientInteraceTypes.getList;
//   if (friendsOrRespectivelyChannel === 0) {
//     list = {
//       command: 'getList',
//       payload: { string: 'getListFriends', username: CLuser.getName() },
//     };
//   } else {
//     list = {
//       command: 'getList',
//       payload: { string: 'getListChannels', username: CLuser.getName() },
//     };
//   }
//   ws.send(JSON.stringify(list));
// }

// export async function addFriendtest(rll: readlineN.Interface, ws: IWebSocket) {
//   rll.resume();
//   const friendName = await rll.question('Friend name: ');
//   if (friendName === '.exit') {
//     rll.pause();
//     object1.func();
//   } else {
//     const addfriend: ClientInteraceTypes.addFriend = {
//       command: 'addFriend',
//       payload: { friendname: friendName, username: CLuser.getName() },
//     };
//     ws.send(JSON.stringify(addfriend));
//     rll.pause();
//   }
// }
// export async function removeFriendtest(rll: readlineN.Interface, ws: IWebSocket) {
//   rll.resume();
//   const friendName = await rll.question('Friend name: ');
//   if (friendName === '.exit') {
//     rll.pause();
//     object1.func();
//   } else {
//     const removefriend: ClientInteraceTypes.removeFriend = {
//       command: 'removeFriend',
//       payload: { friendname: friendName, username: CLuser.getName() },
//     };
//     ws.send(JSON.stringify(removefriend));
//     rll.pause();
//   }
// }

// export async function promptUserInputtest(rll: readlineN.Interface, question: string): Promise<PromptUserReturntype> {
//   rll.resume();
//   CLuser.resumeKeydetection();
//   const answer = await rll.question(`${question} \n`);
//   const timingMap: Map<string, number> = KEY.calculateDelta(CLuser.getTiming(), 2);
//   CLuser.pauseKeydetection();
//   rll.pause();

//   return { text: answer, timings: timingMap };
// }

// const rll = readlineN.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const fakeURL = 'ws://fake-url-2';
// const wss = new MockWebSocketServer(fakeURL);
// const ws = new MockWebSocket(fakeURL, 'client-1');

// /**
//  * Unit tests for functions in client-interface.
//  * All these tests use a test version of the function, this is done to be able to mock user input.
//  */
// describe('addFriend()', () => {
//   it('when given an valid user, addFriend will process correctly', async function () {
//     const addfriend: ClientInteraceTypes.addFriend = {
//       command: 'addFriend',
//       payload: { friendname: '', username: CLuser.getName() },
//     };
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send');
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     await addFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledTimes(0);
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(addfriend));
//   });
//   it('when given .exit, addFriend will return to interfaces', async function () {
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('.exit');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send');
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     await addFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledOnce();
//     // is normally called twice, because it is also called in startinterfaces
//     // but mock implementation for startinterfaces doesn't do that
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenCalledTimes(0);
//   });
// });

// describe('removeFriend()', () => {
//   it('when given an valid user, removeFriend will process correctly', async function () {
//     const removefriend: ClientInteraceTypes.removeFriend = {
//       command: 'removeFriend',
//       payload: { friendname: '', username: CLuser.getName() },
//     };
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send');
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     await removeFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledTimes(0);
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(removefriend));
//   });
//   it('when given .exit, removeFriend will return to interfaces', async function () {
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('.exit');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send');
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     await removeFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledOnce();
//     // is normally called twice, because it is also called in startinterfaces
//     // but mock implementation for startinterfaces doesn't do that
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenCalledTimes(0);
//   });
// });

// describe('selectFriend()', () => {
//   it('when given a valid user, selectFriend will process correctly', async function () {
//     const selectfriend: ClientInteraceTypes.selectFriend = {
//       command: 'SelectFriend',
//       payload: { friendname: '', username: CLuser.getName() },
//     };
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send').mockImplementation(() => {
//       return;
//     });
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     const spyOnSetfriendname = vi.spyOn(CLuser, 'setFriendName');
//     await selectFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledTimes(0);
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnSetfriendname).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(selectfriend));
//   });
//   it('when given .exit, selectfriend will return to interfaces', async function () {
//     const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//       new Promise<string>((resolve) => {
//         resolve('.exit');
//       })
//     );
//     const spyOnWs = vi.spyOn(ws, 'send').mockImplementation(() => {
//       return;
//     });
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });
//     const spyOnSetfriendname = vi.spyOn(CLuser, 'setFriendName');
//     await selectFriendtest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledOnce();
//     expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnSetfriendname).toHaveBeenCalledTimes(0);
//     expect(spyOnWs).toHaveBeenCalledTimes(0);
//   });
// });

// describe('chatFunction()', () => {
//   it('when given a valid user,selectFriend will call chatFunction()', async function () {
//     const usermessage: ClientInteraceTypes.friendMessage = {
//       command: 'friendMessage',
//       payload: {
//         date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
//         text: 'lol',
//         NgramDelta: Object.fromEntries(new Map<string, number>()),
//       },
//     };

//     //hoe doen we dit
//     //const spyOnQuestion = vi.spyOn(rll, 'question').mockReturnValue(
//     //  new Promise<string>((resolve) => {
//     //    resolve('');
//     //  })
//     //);
//     //bij het verzenden
//     const spyOnWs = vi.spyOn(ws, 'send').mockImplementation(() => {
//       return;
//     });

//     const variable: PromptUserReturntype = { text: 'lol', timings: new Map<string, number>() };

//     const spyOnPUserinput = vi.spyOn(object3, 'func').mockReturnValue(
//       new Promise<PromptUserReturntype>((resolve) => {
//         resolve(variable);
//       })
//     );

//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });

//     const spyOnChatFunction = vi.spyOn(object2, 'func').mockImplementation(() => {
//       return new Promise<void>((resolve): void => {
//         resolve();
//       });
//     });

//     //set
//     const spyOnSetChatModus = vi.spyOn(CLuser, 'setChatModus');

//     await chatFunctiontest(rll, ws);
//     expect(spyOnSinterfaces).toHaveBeenCalledTimes(0);
//     expect(spyOnChatFunction).toHaveBeenCalledTimes(1);
//     expect(spyOnPUserinput).toHaveBeenCalledOnce();
//     //expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnSetChatModus).toHaveBeenCalledOnce();
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(usermessage));
//   });

//   it('when given .exit, chatFunction will return to startinterfaces', async function () {
//     const variable: PromptUserReturntype = { text: '.exit', timings: new Map<string, number>() };

//     const spyOnPUserinput = vi.spyOn(object3, 'func').mockReturnValue(
//       new Promise<PromptUserReturntype>((resolve) => {
//         resolve(variable);
//       })
//     );

//     const spyOnWs = vi.spyOn(ws, 'send').mockImplementation(() => {
//       return;
//     });
//     const spyOnSinterfaces = vi.spyOn(object1, 'func').mockImplementation(() => {
//       return;
//     });

//     const spyOnChatFunction = vi.spyOn(object2, 'func').mockImplementation(() => {
//       return new Promise<void>((resolve): void => {
//         resolve();
//       });
//     });

//     const spyOnSetChatModus = vi.spyOn(CLuser, 'setChatModus');
//     await chatFunctiontest(rll, ws);

//     expect(spyOnChatFunction).toHaveBeenCalledTimes(0);
//     expect(spyOnSinterfaces).toHaveBeenCalledOnce();
//     expect(spyOnPUserinput).toHaveBeenCalledOnce();
//     //expect(spyOnQuestion).toHaveBeenCalledOnce();
//     expect(spyOnSetChatModus).toHaveBeenCalledTimes(2);
//     expect(spyOnWs).toHaveBeenCalledTimes(0);
//   });
// });

// describe('getList()', () => {
//   it('when called with 0, getlist is processed correctly', () => {
//     const list: ClientInteraceTypes.getList = {
//       command: 'getList',
//       payload: { string: 'getListFriends', username: CLuser.getName() },
//     };
//     const spyOnWs = vi.spyOn(ws, 'send');
//     getListtest(0, ws);
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(list));
//   });
//   it('when called with 1, getlist is processed correctly', () => {
//     const list: ClientInteraceTypes.getList = {
//       command: 'getList',
//       payload: { string: 'getListChannels', username: CLuser.getName() },
//     };
//     const spyOnWs = vi.spyOn(ws, 'send');
//     getListtest(1, ws);
//     expect(spyOnWs).toHaveBeenNthCalledWith(1, JSON.stringify(list));
//   });
// });
