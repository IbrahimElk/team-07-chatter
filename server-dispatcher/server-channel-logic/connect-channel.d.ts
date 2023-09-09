import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function connectChannel(load: ClientInterfaceTypes.connectChannel['payload'], chatServer: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=connect-channel.d.ts.map