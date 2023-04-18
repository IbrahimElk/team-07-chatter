// @author Barteld Van Nieuwenhove
// @date 2023-4-4

import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import { chatClient } from './start.js';
export class ClientTimetable {
  /**
   * Request a registration from the server by clicking on a button.
   * @param ws websocket, connected to the server
   * @param document document, the login web page loaded in the browser and serves as an entry point into the web page's content, which is the DOM tree.
   * @param ClientUser ClientUser, the user class at the client side.
   * @author Barteld
   */
  public static timetableRequest(ws: IWebSocket) {
    const classRequest: ClientInteraceTypes.requestTimetable = {
      command: 'requestTimetable',
    };
    ws.send(JSON.stringify(classRequest));
  }

  // --------------------------------------------------------------------------------------------------------------------------
  // SENDBACK FUNCTIONS
  // --------------------------------------------------------------------------------------------------------------------------

  /**
   *
   * @param payload
   */
  public static timetableRequestSendback(payload: ServerInterfaceTypes.requestTimetableSendback['payload']) {
    if (payload.succeeded) {
      chatClient.updateTimetable(payload.timeSlot);
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
    }
  }
}
