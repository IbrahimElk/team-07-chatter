import type { ChatServer } from '../server/chat-server.js';
import type * as ClientInterfaceTypes from '../front-end/proto/client-types.js';
import type { IWebSocket } from '../front-end/proto/ws-interface.js';
export declare function verificationHandler(verification: ClientInterfaceTypes.verification['payload'], server: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=verification-handler.d.ts.map