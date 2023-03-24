//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { ClientUser } from './client-user.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

//FIXME: password validation is being done in HTML and CSS, see pattern attribute in input Tag.
// <input id="IdVanPassword" name="password" type="text" autocomplete="off" pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z0-9]{6,}" value="" placeholder="min 6 chars">
// ValidityState
// .patternMismatch	the value does not match the specified pattern attribute
// If true, the element matches the :invalid CSS pseudo-class.

export class ClientLogin {
  private static Id_of_HTML_tags = {
    id_input_username_login: `IdVanInputTagUsernameLogin`,
    id_input_password_login: `IdVanInputTagPasswordLogin`,
    id_input_username_reg: `IdVanInputTagUsernameRegistration`,
    id_input_password_reg: `IdVanInputTagPasswordRegistration`,
  };

  // private static redirect(window: Window, url: string): void {
  //   window.location.href = url;
  // }
  /**
   * @param ws
   * @param document
   * @param ClientUser
   * @author Ibrahim
   */
  public static login(ws: IWebSocket, document: Document, ClientUser: ClientUser) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_login) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_login) as HTMLInputElement;
    const login: ClientInteraceTypes.logIn = {
      command: 'logIn',
      payload: { name: username.value, password: password.value },
    };
    ClientUser.setName(username.value);
    ws.send(JSON.stringify(login));
  }
  /**
   *
   * @param ws
   * @param document
   * @param ClientUser
   * @author Ibrahim
   */
  public static registration(ws: IWebSocket, document: Document, ClientUser: ClientUser) {
    const username = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_username_reg) as HTMLInputElement;
    const password = document.getElementById(ClientLogin.Id_of_HTML_tags.id_input_password_reg) as HTMLInputElement;
    ClientUser.setName(username.value);
    const registration: ClientInteraceTypes.registration = {
      command: 'registration',
      payload: { name: username.value, password: password.value },
    };
    ws.send(JSON.stringify(registration));
  }

  // @John, get info on student...
  public static Initialisation(): void {
    return;
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS TODO: @John
  // --------------------------------------------------------------------------------------------------------------------------

  public static registrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // ClientLogin.redirect(window, '/verdere-registratie-venster');
      // FIXME: initialize all event listners on that page. Zie onLoad() of onPage()
      // eliminate event listeners on other pages?
    } else {
      // Display an error message to the user
      alert(
        `You were not able to succesfully register because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }

  // FIXME: nieuw protocol, voor informatie van student van klassen en gebouwen...
  // inloggen op kuleuven redirection page.... @John
  public static InitialisationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // ClientLogin.redirect(window, '/home-page');
      //TODO: client klasse updaten
    } else {
      // Display an error message to the user
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }

  public static loginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      // ClientLogin.redirect(window, '/home-page');
      //TODO: REQUEST INFO VAN STUDENT VAN SERVER TO DISPLAY.
      //TODO: MAKE CLIENT CLASS
      //FIXME: MSS LOKAAL DATABASE OM DAT OPTESLAAN? (als response time te traag blijkt.)
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
}
