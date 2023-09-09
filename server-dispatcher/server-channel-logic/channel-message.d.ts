import type { IWebSocket } from '../../front-end/proto/ws-interface.js';
import type * as ClientInterfaceTypes from '../../front-end/proto/client-types.js';
import type { ChatServer } from '../../server/chat-server.js';
export declare function channelMessage(message: ClientInterfaceTypes.channelMessage['payload'], server: ChatServer, ws: IWebSocket): Promise<void>;
//# sourceMappingURL=channel-message.d.ts.map