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
    console.log("in validatesession functie, maar niet per see in if, dus niet per see ws.send()");
    const sessionID = ClientUser.getsessionID();
    console.log(sessionID);
    if (sessionID) {
      const list: ClientInteraceTypes.validateSession = {
        command: 'validateSession',
        payload: { sessionID: sessionID },
      };
      const ws = ClientUser.getWebSocket();
      console.log("ws: ");
      console.log(ws);
      console.log("list: ");
      console.log(list);
      console.log(sessionID);

      ws.send(JSON.stringify(list));
    }
    else if(sessionID === null){
      const list: ClientInteraceTypes.validateSession = {
        command: 'validateSession',
        payload: { sessionID: "null" },
      };
      const ws = ClientUser.getWebSocket();
      console.log("ws: ");
      console.log(ws);
      console.log("list: ");
      console.log(list);
      console.log(sessionID);

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
    console.log("tot in sendback functie geraakt");
    if (payload.succeeded) {
      return;
    } else {
      console.log("tot in else geraakt");
      //alert(ClientMisc.errorMessages.validateSessionSendback.replace('typeOfFail', payload.typeOfFail));
      window.location.href = '../index.html';
    }
  }
}
