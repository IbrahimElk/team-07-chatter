import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInteraceTypes from '../protocol/protocol-types-client.js';
import * as readline from 'node:readline/promises';
import * as readlineN from 'node:readline';

import * as CI from './client-interfaces.js';
import * as CL from './client-login.js';
import * as CC from './chat-client.js';

import Debug from 'debug';
import { rawListeners } from 'process';
import { read } from 'fs';
const debug = Debug('client-dispatcher-functions: ');
//_____________________________________________________________________________________
// FUNCTION FOR DISPATCHER:
export async function PromiseregistrationSendback(
  payload: ServerInterfaceTypes.registrationSendback['payload']
): Promise<void> {
  if (payload.succeeded) {
    debug('PromiseregistrationSendback succeeded');
    // PromiseResolve('true');
    CI.startinterfaces();
  } else {
    debug('PromiseregistrationSendback failed');
    console.log('You were not able to succesfully register because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
    await CL.startloginFunctions();

    // PromiseReject('error');
  }
}

export async function PromiseloginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
  if (payload.succeeded) {
    debug('PromiseloginSendback succeeded');
    CI.startinterfaces();
  } else {
    debug('PromiseloginSendback failed');
    console.log('You were not able to succesfully login because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
    await CL.startloginFunctions();
  }
}

export async function selectFriendSendback(payload: ServerInterfaceTypes.selectFriendSendback['payload']) {
  if (payload.succeeded) {
    debug('selectFriendSendback succeeded');
    printFunctionSelect(payload);
    await CI.chatFunction();
  } else {
    debug('selectFriendSendback failed');
    console.log(
      'We were not able to succesfully select your friend because of the following problem: ',
      payload.typeOfFail
    );
    console.log('Please try again');
    CI.selectFriend();
  }
}
export function addFriendSendback(payload: ServerInterfaceTypes.addFriendSendback['payload']) {
  if (payload.succeeded) {
    CI.startinterfaces();
    debug('addFriendSendback succeeded');
    // PromiseResolve('true');
  } else {
    debug('addFriendSendback failed');
    console.log('We were not able to add your friend because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
    CI.addFriend();
    // PromiseReject('error');
  }
}
export function removeFriendSendback(payload: ServerInterfaceTypes.removeFriendSendback['payload']) {
  if (payload.succeeded) {
    CI.startinterfaces();
    debug('removeFriendSendback succeeded');
    // PromiseResolve('true');
  } else {
    debug('removeFriendSendback failed');
    console.log('We were not able to remove your friend because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
    CI.removeFriend();
    // PromiseReject('error');
  }
}

export async function exitMeSendback(payload: ServerInterfaceTypes.exitMeSendback['payload']) {
  if (payload.succeeded) {
    // close websocket connection.
    debug('exitMeSendback succeeded');
    await CL.startloginFunctions();
    // PromiseResolve('true');
  } else {
    debug('exitMeSendback failed');
    console.log('You were not able to succesfully exit because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
    await CL.startloginFunctions();
    // PromiseReject('error');
  }
}

// export function joinChannelSendback(
//   payload: ServerInterfaceTypes.joinChannelSendback['payload'],
//   PromiseResolve: (arg0: string) => void,
//   PromiseReject: (arg0: string) => void
// ) {
//   if (payload.succeeded) {
//     PromiseResolve('true');
//   } else {
//     PromiseReject('error');
//   }
// }

// export function leaveChannelSendback(
//   payload: ServerInterfaceTypes.leaveChannelSendback['payload'],
//   PromiseResolve: (arg0: string) => void,
//   PromiseReject: (arg0: string) => void
// ) {
//   if (payload.succeeded) {
//     PromiseResolve('true');
//   } else {
//     PromiseReject('error');
//   }
// }

// export function selectChannelSendback(
//   payload: ServerInterfaceTypes.selectChannelSendback['payload'],
//   PromiseResolve: (arg0: string) => void,
//   PromiseReject: (arg0: string) => void
// ) {
//   if (payload.succeeded) {
//     PromiseResolve('true');
//   } else {
//     PromiseReject('error');
//   }
// }

export function getListSendback(payload: ServerInterfaceTypes.getListSendback['payload']) {
  if (payload.succeeded) {
    debug('getListSendback succeeded');
    const list = payload.list;
    console.table(list);
    CI.startinterfaces();
  } else {
    debug('getListSendback failed');
    console.log('You were not able to get your list of friends because of the following problem: ', payload.typeOfFail);
    console.log('Please try again');
  }
}

function log(colorForDate: string, date: string, colorForText: string, text: string) {
  // readlineN.cursorTo(process.stdout, 0);
  console.log(colorForDate, date, colorForText, text);
}
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const FgBlack = '\x1b[30m';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

// print message
export function printFunctionSelect(usermessage: ServerInterfaceTypes.selectFriendSendback['payload']) {
  for (const el of usermessage.messages) {
    if (el.sender === CC.CLuser.getFriendName()) {
      log(FgGreen, el.date + ':', FgCyan, el.sender + ': ' + el.text);
      // log(FgCyan, el.sender + ': ' + el.text);
    } else if (el.sender === CC.CLuser.getName()) {
      log(FgGreen, el.date + ':', FgYellow, el.sender + ': ' + el.text);
      // log(FgYellow, el.sender + ': ' + el.text);
    } else {
      log(FgGreen, el.date + ':', FgRed, el.sender + ': ' + el.text);
      // log(FgRed, el.sender + ': ' + el.text);
    }
  }
  console.log('\x1b[0m');
}
export async function printFunction(usermessage: ServerInterfaceTypes.friendMessageSendback['payload']) {
  if (usermessage.sender === CC.CLuser.getFriendName()) {
    debug('usermessage.sender === CC.CLuser.getFriendName()');
    log(FgGreen, usermessage.date + ':', FgCyan, usermessage.sender + ': ' + usermessage.text);
  } else if (usermessage.sender === CC.CLuser.getName()) {
    log(FgGreen, usermessage.date + ':', FgYellow, usermessage.sender + ': ' + usermessage.text);
  } else {
    log(FgGreen, usermessage.date + ':', FgRed, usermessage.sender + ': ' + usermessage.text);
  }
  console.log('\x1b[0m');
  await CI.chatFunction();
}

export function HandleUndefinedMessage(): void {
  debug('HandleUndefinedMessage NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
}
export function HandleIncorrectMessageType(): void {
  debug('HandleIncorrectMessageType NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
}

export function HandleErrorMessage(payload: ServerInterfaceTypes.Error['payload']): void {
  debug(payload.Status);
  debug('HandleErrorMessage NOG TE IMPLEMENTEREN CLIENT_DISPATCHER FUNCTIONS');
}

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
//   prompt: '>:',
// });

// // await rl.question('q1: ');
// for (let i = 0; i < 20; i++) {
//   setTimeout(() => {
//     console.log('\x1b[33m%s\x1b[0m', 'iuuu');
//   }, 3000);
// }
// await rl.question('q2: ');

// const rll = readline.createInterface(process.stdin, process.stdout);

// // Logs a message keeping prompt on last line
// function Log(message: string) {
//   readlineN.cursorTo(process.stdout, 0);
//   console.log(message);
//   rll.prompt(true);
// }

// // Testing the solution

// const userInput = await rll.question('Enter something...:');
// rll.close();
// Log('You typed ' + userInput);

// Log('this should appear above the prompt');
// for (let i = 0; i < 20; i++) {
//   setTimeout(() => Log('this should appear above the prompt'), 5000);
// }
//_____________________________________________________________________________________
