import { User } from '../user/user.js';
import { serverInstance as server } from './chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 * This function is called by the client side when the user wants to log into the server. It will check if the user is a real (defined) user, if the user isn't already connected and if
 *  the password the user gives matches with the password that is saved in the database. If one of the above is unsatisfied the function will send
 *  a message back to the client side containing an error and specifying what went wrong so it can show it to the user. If the clauses are satisfied,
 *  the sendBack message will contain the boolean true and the user will be instantiated.
 *
 * @param load This parameter is the payload (information) of an interface (like all the other (user)functions in this file). In this case it is the login interface that specifies the
 *              type of interface and contains the username and the password that the user has given while trying to log into the chatter.
 * @param ws This parameter specifies the WebSocket that handles the connection between the server and the user. It is used to send back the information
 *            to the user.
 * @returns This function will always generate a 'loginSendBack' interface to send it's conclusions to the client-side. If one of the clauses specified
 *            above (in the description) isn't satisfied, the succeded boolean in this interface will be false and the typeOfFail string will contain a
 *            string specifying what went wrong (if the user gave the wrong username, he/she doesn't have to do the same thing as when he/she gives the
 *            wrong password). If the clauses are satisfied the succeded boolean will contain true.
 * @author Vincent Ferrante
 *
 * @Maite heeft deze docu geschreven:
 * This function is called when a user wants to log in.
 * Firstly, it checks if the user already exist in the database. If this is not the case, the user will not be able to log in.
 * Secondly, it checks if the user is already connected. If this is the case, the user will not be able to log in.
 * Lastly, it checks if the password in the load-parameter matches the password that is linked to the username according to the information saved in the database.
 * Only if this is the case, the user will be able to log in.
 *
 * @param {load} {This contains the username and the password of the user who wants to log in.}
 * @param {ws} {This is the IWebSocket needed to send a message back to the client}
 */

export function userLogin(load: ClientInterfaceTypes.logIn['payload'], ws: IWebSocket): void {
  debug(`inside login function for person with name ${load.name}`);
  const checkPerson: User | undefined = server.getUser(load.name);
  debug(load.name, checkPerson);
  //Check if a user exists with this name, otherwise a user could be created
  if (checkPerson === undefined) {
    const loginAnswer: ServerInterfaceTypes.loginSendback = {
      command: 'loginSendback',
      payload: { succeeded: false, typeOfFail: 'nonExistingName' },
    };
    sendPayLoad(loginAnswer, ws);
    return;
  }
  //Check if the user is already connected
  debug('Is this person connected: ', checkPerson.isConnected());
  if (checkPerson.isConnected()) {
    // person.setConnected(false);
    const loginAnswer: ServerInterfaceTypes.loginSendback = {
      command: 'loginSendback',
      payload: { succeeded: false, typeOfFail: 'userAlreadyConnected' },
    };
    sendPayLoad(loginAnswer, ws);
    return;
  }
  const person: User = new User(load.name, load.password, ws);
  //Check if passwords match
  if (person.getPassword() !== load.password) {
    // person.setConnected(false);
    const loginAnswer: ServerInterfaceTypes.loginSendback = {
      command: 'loginSendback',
      payload: { succeeded: false, typeOfFail: 'falsePW' },
    };
    sendPayLoad(loginAnswer, ws);
    return;
  } else {
    // const user: User = new User(load.name, load.password, ws, undefined);
    //server.systemConnectUser(person);
    const loginAnswer: ServerInterfaceTypes.loginSendback = {
      command: 'loginSendback',
      payload: { succeeded: true },
    };
    sendPayLoad(loginAnswer, ws);
    return;
  }
}
