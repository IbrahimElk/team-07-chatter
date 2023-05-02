import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import { ClientUser } from './client-user.js';

export class ClientMisc {
  private static errorMessages = {
    validateSessionSendback: `We were not able to succesfully validate your session: 'typeOfFail' \nYou will need to login again.`,
  };
  /**
   * Request to validate the session id of this user.
   * @author Barteld
   */
  public static validateSession() {
    const sessionID = ClientUser.getsessionID();
    if (sessionID) {
      const list: ClientInteraceTypes.validateSession = {
        command: 'validateSession',
        payload: { sessionID: sessionID },
      };
      const ws = ClientUser.getWebSocket();
      ws.send(JSON.stringify(list));
    }
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  /**
   * Sendback of validation request, does nothing if valid, redricts to login if invalid.
   * @author Barteld
   */
  public static validateSessionSendback(payload: ServerInterfaceTypes.validateSessionSendback['payload']): void {
    if (payload.succeeded) {
      return;
    } else {
      alert(ClientMisc.errorMessages.validateSessionSendback.replace('typeOfFail', payload.typeOfFail));
      window.location.href = '../index.html';
    }
  }
}
