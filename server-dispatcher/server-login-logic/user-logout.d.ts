import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function userLogout(load: ClientInterfaceTypes.logout['payload'], chatserver: ChatServer, ws: IWebSocket): Promise<void>;
export declare function sendFail(ws: IWebSocket, typeOfFail: string): void;
export declare function sendSucces(ws: IWebSocket): void;
//# sourceMappingURL=user-logout.d.ts.map