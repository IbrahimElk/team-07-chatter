//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

//FIXME: password validation is being done in HTML and CSS, see pattern attribute in input Tag.
// <input id="IdVanPassword" name="password" type="text" autocomplete="off" pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z0-9]{6,}" value="" placeholder="min 6 chars">
// ValidityState
// .patternMismatch	the value does not match the specified pattern attribute
// If true, the element matches the :invalid CSS pseudo-class.

export class ClientLogin {
  private static Id_of_HTML_tags = {
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
      payload: { name: username.value, password: password.value },
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
      payload: { name: username.value, password: password.value },
    };
    ws.send(JSON.stringify(registration));
  }

  // TODO: @John, get info on student...
  public static Initialisation(): void {
    return;
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS TODO: @? no one assigned yet.
  // --------------------------------------------------------------------------------------------------------------------------

  //TODO:
  public static registrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // FIXME: initialize all event listners on that page. Zie onLoad() of onPage()
      // eliminate event listeners on other pages?
    } else {
      // Display an error message to the user
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }

  // TODO:
  public static InitialisationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // FIXME: wat to do after getting the information on the student.
    } else {
      // Display an error message to the user
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }

  // TODO:
  public static loginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      //TODO: REQUEST INFO VAN STUDENT VAN SERVER TO DISPLAY.
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
}
