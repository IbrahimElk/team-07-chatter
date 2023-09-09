import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function listfriends(load: ClientInterfaceTypes.getList['payload'], chatServer: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=list-friends.d.ts.map