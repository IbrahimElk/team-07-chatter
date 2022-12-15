//Author: John Gao
//Date: 2022/11/14

import * as readline from 'node:readline';
import * as readlineP from 'node:readline/promises';

import type * as ClientInteraceTypes from '../protocol/protocol-types-client.js';
import Debug from 'debug';
import { ws } from './chat-client.js';
import * as CC from './chat-client.js';
import * as CT from './chat-timing.js';
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

export function login() {
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
export async function registration() {
  //TODO: check if text that was put in about similar to what the text is?
  //keystroke-delta functie hieruitvoeren.
  const TEXT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu tellus ut nibh hendrerit lobortis a a sapien.';

  const rl = readlineP.createInterface({ input: process.stdin, output: process.stdout });
  const timingSet: PromptUserReturntype = await CT.promptUserInput(rl, `´Typ deze tekst over: ${TEXT}´`);
  rl.close();
  console.log('timingSet in registration functie in client-login.ts', timingSet.timings);
  const rll = readline.createInterface({ input: process.stdin, output: process.stdout });
  rll.question('Username: ', function (username: string) {
    rll.question('Password: ', function (password: string) {
      const registration: ClientInteraceTypes.registration = {
        command: 'registration',
        payload: { name: username, password: password, NgramDelta: Object.fromEntries(timingSet.timings) },
      };
      CC.CLuser.setName(username);
      rll.close();
      debug('about to send to server');
      ws.send(JSON.stringify(registration));
      // hierna na chat-server/chat-server.ts -> onRawmessage()
    });
  });
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

export async function startloginFunctions(): Promise<void> {
  const rl = readlineP.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question('Login or Registration or Exit? (type l or r or e) : ');
  rl.close();

  if (answer === 'l') {
    login();
  } else if (answer === 'r') {
    await registration();
  } else if (answer === 'e') {
    // close websocket connection.
    ws.close();
    process.exit();
  } else {
    debug(`inside start function in catch statement: "error"`);
    await startloginFunctions();
  }
}
