import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { ClientUser } from './client-user.js';
import { client } from '../main.js';
export class ClientMisc {
  private static errorMessages = {
    validateSessionSendback: `We were not able to succesfully validate your session: 'typeOfFail' \nYou will need to login again.`,
  };
  /**
   * Request to validate the session id of this user.
   * @author Barteld
   */
  public static validateSession() {
    const sessionID = client.getsessionID();
    const list: ClientInteraceTypes.validateSession = {
      command: 'validateSession',
      payload: { sessionID: sessionID ?? 'null' },
    };
    const ws = client.getWebSocket();
    ws.send(JSON.stringify(list));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  /**
   * Sendback of validation request, does nothing if valid, redricts to login if invalid.
   * @author Barteld
   */
  public static validateSessionSendback(payload: ServerInterfaceTypes.validateSessionSendback['payload']): void {
    console.log('tot in sendback functie geraakt');
    if (payload.succeeded) {
      return;
    } else {
      console.log('tot in else geraakt');
      //alert(ClientMisc.errorMessages.validateSessionSendback.replace('typeOfFail', payload.typeOfFail));
      window.location.href = '../index.html';
    }
  }
}
