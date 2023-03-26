import { serverInstance } from '../server/chat-server-script.js';
import type { IWebSocket } from '../protocol/ws-interface.js';
import type * as ServerInterfaceTypes from '../protocol/server-types.js';
import type * as ClientInterfaceTypes from '../protocol/client-types.js';
import { debug, sendPayLoad } from './server-dispatcher-functions.js';

/**
 *
 * @param load
 * @param ws
 */
export function exchangeKeys(load: ClientInterfaceTypes.exchangeKeys['payload'], ws: IWebSocket) {
  serverInstance.addConnectionPublicKey(ws, load.publicKey);
  const publicKey: string = serverInstance.getServerPublicKey();
  const publicKeyAnswer: ServerInterfaceTypes.exchangeKeysSendback = {
    command: 'exchangeKeysSendback',
    payload: { succeeded: true, publicKey: publicKey },
  };
  sendPayLoad(publicKeyAnswer, ws);
}
