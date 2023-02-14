//Author: John Gao
//Date: 2022/11/14

import * as readline from 'node:readline';
import * as readlineP from 'node:readline/promises';
import { theSameString, colorString } from '../keystroke-fingerprinting/string-checker.js';
import type * as ClientInteraceTypes from '../protocol/client-types.js';
import Debug from 'debug';
import * as CC from './chat-client.js';
import * as CT from './chat-timing.js';
import type { WebSocket } from 'ws';
const debug = Debug('client-login: ');

type PromptUserReturntype = {
  text: string;
  timings: Map<string, number>;
};

/**
 * This function will handle the login process of a client using a promise.
 * It will ask for 2 inputs, a username and password.
 * These 2 inputs are put in a logIn interface instance, which will be sent to the connected server.
 * The client will then receive a message from the server, which will be handled by the imported "ClientComms".
 *
 * @returns A promise which will be resolved or rejected depending on the message received by the server.
 *
 * @author {John Gao}
 */

export function login(ws: WebSocket) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Username: ', function (username: string) {
    rl.question('Password: ', function (password: string) {
      const login: ClientInteraceTypes.logIn = {
        command: 'logIn',
        payload: { name: username, password: password },
      };
      // debug(login);
      CC.CLuser.setName(username);
      rl.close();
      ws.send(JSON.stringify(login)); // zie chat-server, onClientRawMessage !
    });
  });
}

/**
 * This function will handle the registration process of a client using a promise.
 * It will ask for 2 inputs through the terminal, a username and password.
 * These 2 inputs are put in a registration interface instance, which will be sent to the connected server.
 * The client will then receive a message from the server, which will be handled by the imported "ClientComms".
 *
 * @returns A promise which will be resolved or rejected depending on the message received by the server.
 *
 * @author {John Gao}
 */
export async function registration(ws: WebSocket) {
  //TODO: check if text that was put in about similar to what the text is?
  //keystroke-delta functie hieruitvoeren.
  let rl = readlineP.createInterface({ input: process.stdin, output: process.stdout });
  const timingSet = await TestInput(rl);
  rl.close();
  debug(timingSet);
  if (timingSet.text === '.exit') {
    await startloginFunctions(ws);
    return;
  }
  rl = readlineP.createInterface({ input: process.stdin, output: process.stdout });
  const username = await rl.question('Username: ');
  const password = await rl.question('Password: ');
  const registration: ClientInteraceTypes.registration = {
    command: 'registration',
    payload: { name: username, password: password, NgramDelta: Object.fromEntries(timingSet.timings) },
  };
  CC.CLuser.setName(username);
  rl.close();
  debug('about to send to server');
  ws.send(JSON.stringify(registration));
  // hierna na chat-server/chat-server.ts -> onRawmessage()
}

/**
 * This function will ask the client using a promise whether they want to login or register.
 * When 'l' (login) or 'r' (registration) has been entered, the corresponding function will be called
 * to resolve or reject this promise.
 * As long as the login or registration is unsuccesful (wrong input, serverside rejection), this process will repeat.
 *
 * @returns A promise which will be resolved or rejected depending on input and results of login/registration.
 *
 * @author {John Gao}
 */

async function TestInput(rl: readlineP.Interface): Promise<PromptUserReturntype> {
  const TEXT =
    'Hallo ik ben ibrahim en ik typ nu aan een snelheid dat comfortabel is met mij. Dit is niet gemaakt om ten toonstellen maar bon.';

  let timingSet: PromptUserReturntype = await CT.promptUserInput(rl, `´Typ de volgende tekst over: \n${TEXT}´`);
  // console.log('timingSet in registration functie in client-login.ts', timingSet.timings);
  while (!theSameString(timingSet.text, TEXT) && !(timingSet.text === '.exit')) {
    console.log(colorString(timingSet.text, TEXT));
    console.log('\x1b[0m');
    timingSet = await CT.promptUserInput(rl, `´Typ de volgende tekst over: \n${TEXT}´`);
  }
  return timingSet;
}

export async function startloginFunctions(ws: WebSocket): Promise<void> {
  const rl = readlineP.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question('Login or Registration or Exit? (type l or r or e) : ');
  rl.close();

  if (answer === 'l') {
    login(ws);
  } else if (answer === 'r') {
    await registration(ws);
  } else if (answer === 'e') {
    // close websocket connection.
    ws.close();
    process.exit();
  } else {
    debug(`inside start function in catch statement: "error"`);
    await startloginFunctions(ws);
  }
}
