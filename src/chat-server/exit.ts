import { serverInstance as server } from '../chat-server/chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/protocol-types-server.js';
import type * as ClientInterfaceTypes from '../protocol/protocol-types-client.js';
import { debug } from './server-dispatcher-functions.js';

export function exit(load: ClientInterfaceTypes.exitMe['payload'], ws: IWebSocket): void {
  debug(`inside exit function for person with name ${load.name}`);
  const checkPerson = server.getUser(load.name);
  if (checkPerson === undefined) {
    const loginAnswer: ServerInterfaceTypes.exitMeSendback = {
      command: 'exitMeSendback',
      payload: { succeeded: false, typeOfFail: 'userNotConnected' },
    };
    const result = JSON.stringify(loginAnswer);
    ws.send(result);
    return;
  }
  if (checkPerson.isConnected()) {
    server.systemDisconnectUser(checkPerson);
    const exitAnswer: ServerInterfaceTypes.exitMeSendback = {
      command: 'exitMeSendback',
      payload: { succeeded: true },
    };
    const result = JSON.stringify(exitAnswer);
    ws.send(result);
    return;
  }
}
