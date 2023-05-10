//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import type { ClientUser } from './client-user.js';
import { encodeHTMlInput } from '../encode-decode/encode.js';

export class ClientLogin {
  public static Id_of_tags = {
    input_username_login: `sign-in-username`,
    input_password_login: `password`,
    input_username_reg: `register-username`,
    input_password_reg: `password-register`,
  };
  /**
   * Request a login from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @author Ibrahim
   */
  public static login(client: ClientUser, ws: IWebSocket | WebSocket, usernameInput: string, passwordInput: string) {
    const sessionID = client.getsessionID();
    if (sessionID) {
      const login: ClientInteraceTypes.login = {
        command: 'login',
        payload: {
          sessionID,
          usernameUUID: encodeHTMlInput(`@${usernameInput}`),
          password: encodeHTMlInput(passwordInput),
        },
      };
      ws.send(JSON.stringify(login));
    }
  }
  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @author Ibrahim
   */
  public static registration(client: ClientUser, ws: IWebSocket | WebSocket, username: string, password: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const registration: ClientInteraceTypes.registration = {
        command: 'registration',
        payload: {
          sessionID: sessionId,
          usernameUUID: encodeHTMlInput(username),
          password: encodeHTMlInput(password),
        },
      };
      ws.send(JSON.stringify(registration));
    }
  }

  public static logout(client: ClientUser): void {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const logoutJSON: ClientInteraceTypes.logout = {
        command: 'logout',
        payload: { sessionID: sessionId },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(logoutJSON));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static registrationSendback(
    client: ClientUser,
    payload: ServerInterfaceTypes.registrationSendback['payload']
  ): void {
    if (payload.succeeded) {
      client.setUUID(payload.user.UUID);
      client.setUsername(payload.user.name);
      client.setProfilePicture(payload.user.profilePicture);
      client.updateTimetable(payload.timetable);

      window.location.href = './home/home.html';
    } else {
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
  public static loginSendback(client: ClientUser, payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      client.setUUID(payload.user.UUID);
      client.setUsername(payload.user.name);
      client.setProfilePicture(payload.user.profilePicture);
      client.updateTimetable(payload.timetable);

      window.location.href = './home/home.html';

      // if with kuleuven login(other branch) (timetable is opgeslagen in localStorage)
      // window.location.href = './home/home.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
  public static logoutSendback(client: ClientUser, payload: ServerInterfaceTypes.logoutSendback['payload']): void {
    if (payload.succeeded) {
      sessionStorage.clear();
      const ws = client.getWebSocket() as WebSocket;
      ws.close();
      window.location.href = '../index.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully logout because of the following problem: ${error}\n Please try again`);
    }
  }

  public static sessionIDSendback(client: ClientUser, payload: ServerInterfaceTypes.sessionIDSendback['payload']) {
    client.setsessionID(payload.value);
  }
}
