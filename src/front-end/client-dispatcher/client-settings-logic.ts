import type * as ClientInteraceTypes from './../proto/client-types.js';
import type * as ServerInterfaceTypes from './../proto/server-types.js';
import type { IWebSocket } from '../proto/ws-interface.js';



export function changeUsernameSendback(payload: ServerInterfaceTypes.changeUsernameSendback['payload']): void {
    if (payload.succeeded) {
        alert('Username approved')
        

    } else {
      alert(
        `You were not able to succesfully change the username because of the following problem: ${payload.typeOfFail}\n Please try again`
      );
    }
  }
