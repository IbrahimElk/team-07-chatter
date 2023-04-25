/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';
import { ClientUser } from './client-user.js';
export class ClientLogin {
  public static Id_of_HTML_tags = {
    id_input_username_login: `sign-in-username`,
    id_input_password_login: `password`,
    id_input_username_reg: `register-username`,
    id_input_password_reg: `password-register`,
  };
  /**
   * Request a login from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Ibrahim
   */
  public static login(ws: IWebSocket | WebSocket, document: Document) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_login) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;
    const sessionId = ClientUser.getsessionID();
    console.log(sessionId);
    console.log('----------------------------');
    if (sessionId) {
      const login: ClientInteraceTypes.logIn = {
        command: 'logIn',
        payload: { sessionID: sessionId, usernameUuid: username.value, password: password.value },
      };
      console.log('login');
      ws.send(JSON.stringify(login));
    }
  }
  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Ibrahim
   */
  public static registration(ws: IWebSocket | WebSocket, document: Document) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_reg) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_reg) as HTMLInputElement;
    const sessionId = ClientUser.getsessionID();
    console.log(sessionId);
    if (sessionId) {
      const registration: ClientInteraceTypes.registration = {
        command: 'registration',
        payload: { sessionID: sessionId, usernameUuid: username.value, password: password.value },
      };
      ws.send(JSON.stringify(registration));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static registrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      console.log('registrationSendback');
      window.location.href = './home/3D.html';
      ClientUser.setUUID(payload.usernameId);
      ClientUser.updateTimetable(payload.timetable);
    } else {
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
  //  (since window is Global)
  public static loginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      window.location.href = './home/3D.html';
      ClientUser.setUUID(payload.usernameId);
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
  // store session ID in browser cookie for an hour, and you can access the value from any path within any tab in the browser
  public static sessionIDSendback(payload: ServerInterfaceTypes.sessionIDSendback['payload']) {
    ClientUser.setsessionID(payload.value);
    console.log('sessionIDSendback');
  }
}
