//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import { showUsername } from '../front-end/navbar-settings/display-username.js';
import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
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
  public static login(ws: IWebSocket, document: Document) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_login) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;
    const login: ClientInteraceTypes.logIn = {
      command: 'logIn',
      payload: { usernameUuid: username.value, password: password.value },
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
  public static registration(ws: IWebSocket, document: Document) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_reg) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_reg) as HTMLInputElement;
    const registration: ClientInteraceTypes.registration = {
      command: 'registration',
      payload: { usernameUuid: username.value, password: password.value },
    };
    ws.send(JSON.stringify(registration));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  public static registrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      showUsername.displayUsername(payload);
      // FIXME: initialize all event listners on that page. Zie onLoad() of onPage()
      // eliminate event listeners on other pages?
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
      showUsername.displayUsername(payload);
      //TODO: REQUEST INFO VAN STUDENT VAN SERVER TO DISPLAY.
      window.location.href = 'home.html';
      localStorage.setItem('usernameId', payload.usernameId);
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
}
