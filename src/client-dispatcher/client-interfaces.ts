// export async function joinChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const joinchannel: ClientInteraceTypes.joinChannel = {
//         command: 'joinChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(joinchannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   })
//     .catch(function () {
//       console.log('Fail, try again...');
//     })
//     .then(() => startinterfaces(name));
// }

// export async function leaveChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const leavechannel: ClientInteraceTypes.leaveChannel = {
//         command: 'leaveChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(leavechannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   })
//     .catch(function () {
//       console.log('Fail, try again...');
//     })
//     .then(() => startinterfaces(name));
// }

// export async function selectChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const selectchannel: ClientInteraceTypes.selectChannel = {
//         command: 'selectChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(selectchannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   }).catch(function () {
//     console.log('Fail, try again...');
//   });
//   //.then(() => steps.start()); //indien gelukt: je kan beginnen chatten
// }

// Author: Amélie Van Loock
// Date: 2022/12/14

// import WebSocket from 'ws';
import * as readline from 'node:readline';
import * as readlineN from 'node:readline/promises';
import { promptUserInput } from './chat-timing.js';
import type * as ClientInteraceTypes from '../protocol/client-types.js';
import Debug from 'debug';
import * as CC from './chat-client.js';
import * as CT from './chat-timing.js';
import type WebSocket from 'ws';

const debug = Debug('Client-interface: ');

export function selectFriend(ws: WebSocket): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Friend name: ', (answer) => {
    rl.close();
    if (answer === '.exit') {
      startinterfaces(ws);
    } else {
      const friendName: string = answer;
      const selectfriend: ClientInteraceTypes.selectFriend = {
        command: 'SelectFriend',
        payload: { friendname: friendName, username: CC.CLuser.getName() },
      };
      CC.CLuser.setFriendName(friendName);
      // debug('inside selectfriend: friendname', CC.CLuser.getFriendName());
      // debug('inside selectfriend: myname', CC.CLuser.getName());
      ws.send(JSON.stringify(selectfriend));
    }
  });
}

// deze vraagt aan server voor alle voorgaande messages => gaat deze printen
// verwijst door nr nieuwe terminal waarin we kunnen gaan chatten
// in deze interface: chatten
// om uit deze interface te geraken: bepaalde toetsenbordcombinatie
// voor je bericht gaat sturen bepaalde functie oproepen die dit bericht mooi gaat printen id terminal
// als je bericht ontvangt ook deze functie oproepen zodat het ontvangen bericht mooi wordt geprint
// nieuwe functie met andere interfac
// => deze interface bevat: user name, bericht,
// => deze functie heel de tijd opnieuw doen => als promiseresolve => then ...(zelfde functie uitvoeren)
// =>als bepaalde toetsenbordcombinatie => promise catch => terug gaan naar steps.start

// Logs a message keeping prompt on last line
// function log(rl: readline.Interface, message: string) {
//   readline.cursorTo(process.stdout, 0);
//   console.log(message);
//   rl.prompt(true);
// }
// export function chatFunction(): void {
//   CC.CLuser.setChatModus(true);
//   const rl = readline.createInterface(process.stdin, process.stdout);
//   rl.close();
//   rl.question('Enter something...:', (userInput) => {
//     if (userInput !== '.exit') {
//       CC.CLuser.setChatModus(false);
//       rl.close();
//     }
//     const usermessage: ClientInteraceTypes.friendMessage = {
//       command: 'friendMessage',
//       payload: {
//         date: Date.now().toString(),
//         text: userInput,
//         NgramDelta: Object.fromEntries(new Map<string, number>()),
//       },
//     };
//     debug('verzenden');
//     ws.send(JSON.stringify(usermessage));
//   });
// }

type PromptUserReturntype = {
  text: string;
  timings: Map<string, number>;
};

export async function chatFunction(ws: WebSocket): Promise<void> {
  CC.CLuser.setChatModus(true, CC.CLuser.getFriendName());

  const rll = readlineN.createInterface({ input: process.stdin, output: process.stdout });
  const timingSet: PromptUserReturntype = await CT.promptUserInput(rll, '>: ');
  rll.close();
  debug('timings in chatfuntion in client-interface.ts', timingSet);
  if (timingSet.text === '.exit') {
    startinterfaces(ws);
    CC.CLuser.setChatModus(false, CC.CLuser.getFriendName());
    return;
  }
  const usermessage: ClientInteraceTypes.friendMessage = {
    command: 'friendMessage',
    payload: {
      date: new Date()
        .toISOString()
        .replace(/T/, ' ') // replace T with a space
        .replace(/\..+/, ''), // delete the dot and everything after,,
      text: timingSet.text,
      NgramDelta: Object.fromEntries(timingSet.timings),
    },
  };
  // debug('verzenden', usermessage);
  ws.send(JSON.stringify(usermessage));
  await chatFunction(ws);
}

export function getList(friendsOrRespectivelyChannel: 0 | 1, ws: WebSocket) {
  let list: ClientInteraceTypes.getList;
  if (friendsOrRespectivelyChannel === 0) {
    list = {
      command: 'getList',
      payload: { string: 'getListFriends', username: CC.CLuser.getName() },
    };
  } else {
    list = {
      command: 'getList',
      payload: { string: 'getListChannels', username: CC.CLuser.getName() },
    };
  }
  ws.send(JSON.stringify(list));
}

export function addFriend(ws: WebSocket) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Friend name: ', (friendName) => {
    rl.close();
    if (friendName === '.exit') {
      startinterfaces(ws);
    } else {
      const addfriend: ClientInteraceTypes.addFriend = {
        command: 'addFriend',
        payload: { friendname: friendName, username: CC.CLuser.getName() },
      };
      ws.send(JSON.stringify(addfriend));
    }
  });
}

export function removeFriend(ws: WebSocket) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Friend name: ', (friendName) => {
    rl.close();
    if (friendName === '.exit') {
      startinterfaces(ws);
    } else {
      const removefriend: ClientInteraceTypes.removeFriend = {
        command: 'removeFriend',
        payload: { friendname: friendName, username: CC.CLuser.getName() },
      };
      ws.send(JSON.stringify(removefriend));
    }
  });
}

// export async function joinChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const joinchannel: ClientInteraceTypes.joinChannel = {
//         command: 'joinChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(joinchannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   })
//     .catch(function () {
//       console.log('Fail, try again...');
//     })
//     .then(() => startinterfaces(name));
// }

// export async function leaveChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const leavechannel: ClientInteraceTypes.leaveChannel = {
//         command: 'leaveChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(leavechannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   })
//     .catch(function () {
//       console.log('Fail, try again...');
//     })
//     .then(() => startinterfaces(name));
// }

// export async function selectChannel() {
//   return new Promise<string>((resolve, reject) => {
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//     PromiseResolve = resolve;
//     PromiseReject = reject;

//     rl.question('Channel name: ', function (channel: string) {
//       const selectchannel: ClientInteraceTypes.selectChannel = {
//         command: 'selectChannel',
//         payload: { channelname: channel, username: name },
//       };
//       ws.send(JSON.stringify(selectchannel));
//     });
//     rl.close();

//     ws.on('message', function (message: string) {
//       ClientComms.DispatcherClient(message, PromiseResolve, PromiseReject);
//     });
//   }).catch(function () {
//     console.log('Fail, try again...');
//   });
//   //.then(() => steps.start()); //indien gelukt: je kan beginnen chatten
// }

export function exit(ws: WebSocket) {
  const exitMe: ClientInteraceTypes.exitMe = {
    command: 'exitMe',
    payload: { name: CC.CLuser.getName() },
  };
  debug('about to send to server');
  ws.send(JSON.stringify(exitMe));
}

export function startinterfaces(ws: WebSocket) {
  const rll = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  console.log('Please select one of the following functions:');
  const functionsTable = [
    { Function: 'list of friends' }, // 0
    // { Function: 'list of groupchats' }, // 1
    { Function: 'select friend' }, // 2
    { Function: 'add friend' }, // 3
    { Function: 'remove friend' }, // 4
    // { Function: 'join channel' }, // 5
    // { Function: 'leave channel' }, // 6
    // { Function: 'select channel' }, // 7
    { Function: 'exit' },
  ];
  console.table(functionsTable);

  const steps = {
    start: (ws: WebSocket) => {
      return steps.selectNumber(ws);
    },
    selectNumber: (ws: WebSocket) => {
      rll.question('Number of function: ', (selectNumber: string) => {
        if (selectNumber === '0') {
          return steps.Number0();
        }
        if (selectNumber === '1') {
          return steps.Number1();
        }
        if (selectNumber === '2') {
          return steps.Number2();
        }
        if (selectNumber === '3') {
          return steps.Number3();
        }
        if (selectNumber === '4') {
          rll.close();
          return exit(ws);
        } else {
          const message = 'Invalid number, type a new one';
          console.log(message);
          steps.start(ws);
        }
        /**

        try {
          if (selectNumber === '0') {
            return steps.Number0();
          }
          if (selectNumber === '1') {
            return steps.Number1();
          }
          if (selectNumber === '2') {
            return steps.Number2();
          }
          if (selectNumber === '3') {
            return steps.Number3();
          }
          if (selectNumber === '4') {
            rll.close();
            return exit();
            // return CL.startloginFunctions();
          }
          // if (selectNumber === '3') {
          //   return steps.Number3();
          // }
          // if (selectNumber === '5') {
          //   return steps.Number5();
          // }
          // if (selectNumber === '6') {
          //   return steps.Number6();
          // }
          // if (selectNumber === '7') {
          //   return steps.Number7();
          // }
        } catch (error) {
          const message = 'Invalid number, type a new one';
          console.log(message);
          steps.start();
        }
         */
      });
    },

    Number0: () => {
      rll.close();
      getList(0, ws);
    },
    // Number1: async () => {
    //   rl.close();
    //   await getList(1);
    // },

    Number1: () => {
      rll.close();
      selectFriend(ws);
    },

    Number2: () => {
      rll.close();
      addFriend(ws);
      // await addFriend().then();
    },

    Number3: () => {
      rll.close();
      removeFriend(ws);
      //await removeFriend().then((result) => console.log(result));
    },

    // Number5: async () => {
    //   rl.close();
    //   await joinChannel().then((result) => console.log(result));
    //   //await removeFriend().then((result) => console.log(result));
    // },

    // Number6: async () => {
    //   rl.close();
    //   await leaveChannel().then((result) => console.log(result));
    // },

    // Number7: async () => {
    //   rl.close();
    //   await selectChannel().then((result) => console.log(result));
    // },

    // Number8: async () => {
    //   rl.close();
    //   await selectChannel().then((result) => console.log(result));
    // },

    // Number8: async () => {
    //   rl.close();
    //   await exitChannel().then((result) => console.log(result));
    // },
  };
  steps.start(ws);
}

// await startinterfaces('mijnnaam');
