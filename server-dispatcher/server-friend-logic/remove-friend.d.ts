import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function removefriend(load: ClientInterfaceTypes.removeFriend['payload'], chatserver: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=remove-friend.d.ts.map