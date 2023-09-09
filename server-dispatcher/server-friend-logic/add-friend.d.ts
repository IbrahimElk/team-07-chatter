import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function addfriend(load: ClientInterfaceTypes.addFriend['payload'], chatServer: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=add-friend.d.ts.map