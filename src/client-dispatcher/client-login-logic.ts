//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';

import type { WebSocket } from 'ws';
import type { ClientUser } from './client-user.js';

//FIXME: password validation is being done in HTML and CSS, see pattern attribute in input Tag.
// <input id="IdVanPassword" name="password" type="text" autocomplete="off" pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z0-9]{6,}" value="" placeholder="min 6 chars">
// ValidityState
// .patternMismatch	the value does not match the specified pattern attribute
// If true, the element matches the :invalid CSS pseudo-class.

export class ClientLogin {
  /**
   * @param ws
   * @param document
   * @param ClientUser
   * @author Ibrahim
   */
  public static login(ws: WebSocket, document: Document, ClientUser: ClientUser) {
    // Get username from input tag
    const username = document.getElementById('IdVanInputTag') as HTMLInputElement;
    // Get password from input tag
    const password = document.getElementById('IdVanInputTag') as HTMLInputElement;
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
  public static registration(ws: WebSocket, document: Document, ClientUser: ClientUser) {
    const username = document.getElementById('IdVanInputTag') as HTMLInputElement;
    // Get password from input tag
    const password = document.getElementById('IdVanInputTag') as HTMLInputElement;

    ClientUser.setName(username.value);
    const registration: ClientInteraceTypes.registration = {
      command: 'registration',
      payload: { name: username.value, password: password.value },
    };
    ws.send(JSON.stringify(registration));
  }

  private static redirect(window: Window, url: string): void {
    window.location.href = url;
  }

  public static PromiseregistrationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // redirect to page where you put in you settings for the first time.
      ClientLogin.redirect(window, '/verdere-registratie-venster');
      // TODO: client klasse updaten.
    } else {
      // Display an error message to the user
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }

  // FIXME: nieuw protocol, voor informatie van student van klassen en gebouwen...
  public static PromiseInitialisationSendback(payload: ServerInterfaceTypes.registrationSendback['payload']): void {
    if (payload.succeeded) {
      // redirect to page where you put in you settings for the first time.
      ClientLogin.redirect(window, '/home-page');
      //TODO: client klasse updaten
    } else {
      // Display an error message to the user
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully register because of the following problem: ${error}\n Please try again`);
    }
  }

  public static PromiseloginSendback(payload: ServerInterfaceTypes.loginSendback['payload']) {
    if (payload.succeeded) {
      ClientLogin.redirect(window, '/home-page');
      //TODO: REQUEST INFO VAN STUDENT VAN SERVER TO DISPLAY.
      //TODO: MAKE CLIENT CLASS
      //FIXME: MSS LOKAAL DATABASE OM DAT OPTESLAAN? (als response time te traag blijkt.)
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to succesfully login because of the following problem: ${error}\n Please try again`);
    }
  }
}
