//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import { Clientuser } from './client-user.js';
export class ClientLogin {
  /**
   * Request a login from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Ibrahim
   */
  public static login(ws: IWebSocket, usernameId: string, password: string) {
    const login: ClientInteraceTypes.logIn = {
      command: 'logIn',
      payload: { usernameUuid: usernameId, password: password },
    };
    ws.send(JSON.stringify(login));
  }
  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Ibrahim
   */
  public static registration(ws: IWebSocket, usernameId: string, password: string) {
    // const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_reg) as HTMLInputElement;
    // const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_reg) as HTMLInputElement;
    const registration: ClientInteraceTypes.registration = {
      command: 'registration',
      payload: { usernameUuid: usernameId, password: password },
    };
    ws.send(JSON.stringify(registration));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static registrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      window.location.href = 'home.html';
      localStorage.setItem('usernameId', payload.usernameId);
    } else {
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
  //  (since window is Global)
  public static loginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      window.location.href = 'home.html';
      localStorage.setItem('usernameId', payload.usernameId);
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
}
