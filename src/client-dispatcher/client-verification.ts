// Author: Thomas Evenepoel
// Date: 05/04/2023
import type * as ClientInteraceTypes from '../protocol/client-types.js';
import type { IWebSocket } from '../protocol/ws-interface.js';

export class ClientVerification {
  public static sendVerification(ws: IWebSocket, document: Document, getTimeStamps: Array<[string, number]>): void {
    const verification: ClientInteraceTypes.verification = {
      command: 'verification',
      payload: {
        NgramDelta: getTimeStamps,
      },
    };
    ws.send(JSON.stringify(verification));
  }
}
