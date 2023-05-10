//Author: Ibrahim El Kaddouri
//Date: 2022/11/14

import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { ClientUser } from './client-user.js';

export class ClientHome {
  public static timetableRequest(client: ClientUser, authenticationCode: string) {
    const sessionId = client.getsessionID();
    if (sessionId) {
      const classRequest: ClientInteraceTypes.requestTimetable = {
        command: 'requestTimetable',
        payload: {
          sessionID: sessionId,
          authenticationCode: authenticationCode,
        },
      };
      const ws = client.getWebSocket();
      ws.send(JSON.stringify(classRequest));
    }
  }

  public static timetableRequestSendback(
    client: ClientUser,
    payload: ServerInterfaceTypes.requestTimetableSendback['payload']
  ) {
    if (payload.succeeded) {
      client.updateTimetable(payload.timetable);
      window.location.href = '../home/home.html';
    } else {
      const error = payload.typeOfFail;
      alert(`You were not able to get the next class because of the following problem: ${error}\n Please try again`);
    }
  }
}
