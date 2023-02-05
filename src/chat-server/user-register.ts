import { User } from '../user/user.js';
import { serverInstance as server } from './chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 * This function is called by the client-side when a new user wants to register. It will check if the given username alredy is in use, and if the passwoord
 *  he/she wants to use is 'safe' enough (contains at leaast 8 characters, an uppercase letter, a lowercase letter and a punctuation mark). If these clauses
 *  are unsatisfied, an interface "registrationSendBack" wil be sent to the client-side containing the succeded boolean that will be false and the typeOfFail
 *  string that will contain a string specifying what went wrong. If all the clauses are satisfied, the function will send the same interface, but the
 *  succeded boolean will be true, and the user will be created.
 *
 * @param load This parameter is the payload (information) of a registration interface that will contain the username and password the user has given while trying to log into the
 *              chatter.
 * @param ws This parameter is the WebSocket that is used for sending the registrationSendBack interface to the client-side of the server.
 * @returns This function will always generate a 'registrationSendBack' interface to send it's conclusions to the client-side. If one of the clauses
 *            specified above (in the description) isn't satisfied, the succeded boolean in this interface will be false and the typeOfFail string will
 *            contain a string specifying what went wrong (if the user gave the wrong username, he/she doesn't have to do the same thing as when he/she
 *            gives a weak password). If the clauses are satisfied the succeded boolean will contain true.
 * @author Vincent Ferrante
 *
 * @maite
 * This function is called when a new user wants to register.
 * Firstly, it checks if there exists already a user in the database with the same username as in the load-parameter. If this is the case, the user will not be able to register.
 * Secondly, it checks if the password meets the correct requirements by calling the function checkPW.
 * The password has to be at least 8 characters long and it needs to contain at least one punctuation and one capital letter.
 * If one of this requirements is not met, the user will not be able to register.
 * Thirdly, it checks if the username is not an empty string. If the username is an empty string, the user will not be able to register.
 * Lastly, if all three requirements above are met, this function will create a new user with the parameters of this function.
 *
 * @param {load} {This contains the username and the password of the user who wants to register.}
 * @param {ws} {This is the IWebSocket needed to send a message back to the client}
 *
 */

export function userRegister(load: ClientInterfaceTypes.registration['payload'], ws: IWebSocket): void {
  const letters: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ&|é@#(§è!ç{à}°)_-¨*$[]%£ùµ´`^?./+,;:=~><\\"\''.split('');
  const NgramCounter = new Map(
    letters
      .map((a) => letters.map((b) => a + b)) // [["AA","AB",...,"AZ"],["BA","BB",...,"BZ"], ... ,["ZA","ZB",...,"ZZ"]]
      .flat(1) // ["AA","AB",...,"AZ","BA","BB",...,"BZ", ... ,"ZA","ZB",...,"ZZ"]
      .map((a) => [a, 0]) //[["AA",0],["AB",0],...,["ZZ",0]]
  );

  const NgramDelta = new Map(Object.entries(load.NgramDelta)); //van object terug naar map
  const checkPerson: User | undefined = server.getUser(load.name);

  //Check if a user exists with the given (through the parameters) name
  // debug('checkPerson', checkPerson);
  if (checkPerson !== undefined) {
    debug('and this is user.getNgrams in register function', checkPerson.getNgrams());
    const registrationAnswer: ServerInterfaceTypes.registrationSendback = {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: 'existingName' },
    };
    sendPayLoad(registrationAnswer, ws);
    return;
  }

  //Check if the given password is long enough
  else if (checkPW(load.password) !== 'true') {
    const registrationAnswer: ServerInterfaceTypes.registrationSendback = {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: checkPW(load.password) },
    };
    sendPayLoad(registrationAnswer, ws);
    return;
  } else if (load.name.length < 1) {
    const registrationAnswer: ServerInterfaceTypes.registrationSendback = {
      command: 'registrationSendback',
      payload: { succeeded: false, typeOfFail: 'length of name is shorter than 1' },
    };
    sendPayLoad(registrationAnswer, ws);
    return;
  }

  //Create a new user
  else {
    debug('create new user');
    new User(load.name, load.password, ws, undefined, NgramDelta, NgramCounter);
    const registrationAnswer: ServerInterfaceTypes.registrationSendback = {
      command: 'registrationSendback',
      payload: { succeeded: true },
    };
    debug('send back statement in register function');
    sendPayLoad(registrationAnswer, ws);
    server.printUsers();
    server.printConnectedUsers();
    return;
  }
}

/**
 * This is a helper-function used in the function register that checks if the password is strong enough. That means that is checks if the password contains
 *  at least one uppercase-, and one lowercase letter, a punctuation mark and at least 8 characters.
 * IMPORTANT: The order of checks is: length -> contais an uppercase letter -> contains a lowercase letter -> contains a punctuation mar. If the password
 *  doesn't satisfy a clause, the resulting clauses will not be checked. For example if the password is long enough, but doesn'contain an uppercase letter
 *  and a punctuation mark, the user will only know that his/her password must contain an uppercase letter. When he/ she fixes this mistake but the password
 *  still doesn't contain a punctuation mark it will be reported to him/her the next time he/she tries to register.
 *
 * @param password This parameter is the password the user want's to use, so it's the password the function has to check.
 * @returns This function returns the string message specifying the result of the function. It starts of as 'false' and if all the checks are satisfied it
 *            will contain 'true'. If one of the clauses is unsatisfied message will contain the string specifying which check has failed.
 * @author Vincent Ferrante
 */
function checkPW(password: string): string {
  let message = 'false';
  if (password.length < 8) {
    message = 'shortPW';
  }
  let hasUppercase = false;
  let hasPunctuation = false;
  const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  for (let i = 0; i < password.length; i++) {
    if (password.charAt(i) === password.charAt(i).toUpperCase()) {
      hasUppercase = true;
    }
    if (punctuation.includes(password.charAt(i))) {
      hasPunctuation = true;
    }
  }
  if (!hasUppercase) {
    message = 'noUppercaseInPW';
  } else if (!hasPunctuation) {
    message = 'noPunctuationInPW';
  } else {
    message = 'true';
  }
  return message;
}
